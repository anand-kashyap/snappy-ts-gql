import { Config } from 'apollo-server';
import mongoose from 'mongoose';

interface SConfig extends Config {
  context: {
    callbackWaitsForEmptyEventLoop: boolean;
  };
}

let cachedMongoConn = null;
const { DB_USER, DB_PASS, DB_NAME, PROD, TEST } = process.env as any;

const gracefulShutdown = (msg: string, callback: () => void) => {
  mongoose.connection.close();
  console.log('❌ Mongo disconnected through ' + msg);
  callback();
};

const logListeners = () => {
  if (cachedMongoConn === null || !PROD) {
    mongoose.connection.on('connected', () => console.log('🍖 db connected'));
    mongoose.connection.on('error', function (err) {
      console.log('error in mongo connection: ' + err.message);
      mongoose.disconnect();
    });

    mongoose.connection.on('disconnected', function () {
      console.log('😥 db disconnected');
    });
    ['SIGINT', 'SIGTERM'].forEach((f) => {
      process.on(f, function () {
        gracefulShutdown('app termination', function () {
          process.exit(0);
        });
      });
    });
    // For nodemon restarts
    process.once('SIGUSR2', function () {
      gracefulShutdown('nodemon restart', function () {
        process.kill(process.pid, 'SIGUSR2');
      });
    });
  }
};

const conn = () => {
  let defOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  };
  const netlify = {
    useFindAndModify: false,
    connectTimeoutMS: 30000,
    bufferCommands: false, // Disable mongoose buffering
    bufferMaxEntries: 0, // and MongoDB driver buffering
  };
  if (PROD) {
    defOpts = { ...defOpts, ...netlify };
  }
  let uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0-yu8za.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
  if (TEST) {
    uri = 'mongodb://localhost:27017/test';
    console.log('🦍 connecting to local test DB');
  }
  return mongoose.connect(uri, defOpts);
};

const connectDatabase = (context: SConfig['context']) => {
  if (!PROD) {
    return conn();
  }
  context.callbackWaitsForEmptyEventLoop = false;
  return new Promise((resolve, reject) => {
    (mongoose as any).Promise = global.Promise;
    if (!cachedMongoConn) {
      cachedMongoConn = conn().then(
        () => resolve(cachedMongoConn),
        (e) => reject(e)
      );
    } else {
      resolve(cachedMongoConn);
    }
  });
};

logListeners();

export { connectDatabase, SConfig };
