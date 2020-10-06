import mongoose from 'mongoose';

const { DB_USER, DB_PASS, DB_NAME, PROD } = process.env as any;

const conn = () => {
  let defOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  };
  const netlify = {
    useFindAndModify: false,
    connectTimeoutMS: 10000,
    bufferCommands: false, // Disable mongoose buffering
    bufferMaxEntries: 0, // and MongoDB driver buffering
  };
  if (PROD) {
    defOpts = { ...defOpts, ...netlify };
  }
  mongoose.connection.on('connected', () => console.log('🍖 db connected'));
  mongoose.connection.on('error', function (err) {
    console.log('error in mongo connection: ' + err.message);
    mongoose.disconnect();
  });

  mongoose.connection.on('disconnected', function () {
    console.log('😥 db disconnected');
  });
  return mongoose
    .connect(
      `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0-yu8za.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
      defOpts
    )
    .catch(console.error);
};

let cachedMongoConn = null;

function connectDatabase(context) {
  if (!PROD) {
    return Promise.resolve();
  }
  context.callbackWaitsForEmptyEventLoop = false;
  return new Promise((resolve, reject) => {
    mongoose.Promise = global.Promise;
    mongoose.connection
      // Reject if an error occurred when trying to connect to MongoDB
      .on('error', (error) => {
        console.log('Error: connection to DB failed');
        reject(error);
      })
      .on('close', () => {
        console.log('Error: Connection to DB lost');
        process.exit(1);
      })
      // Connected to DB
      .once('open', () => {
        // Display connection information
        const infos = mongoose.connections;

        infos.map((info) =>
          console.log(`Connected to ${info.host}:${info.port}/${info.name}`)
        );
        // Return successful promise
        resolve(cachedMongoConn);
      });
    if (!cachedMongoConn) {
      cachedMongoConn = conn();
    } else {
      resolve(cachedMongoConn);
    }
  });
}

export { connectDatabase, conn as connectDev };
