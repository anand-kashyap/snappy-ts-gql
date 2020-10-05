import mongoose from 'mongoose';

const { DB_USER, DB_PASS, DB_NAME } = process.env as any;

const conn = () => {
  mongoose.connection.on('connected', () => console.log('connected db'));
  mongoose
    .connect(
      `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0-yu8za.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    )
    .catch(console.error);
};

let cachedMongoConn = null;

function connectDatabase() {
  return new Promise((resolve, reject) => {
    mongoose.Promise = global.Promise;
    mongoose.connection
      // Reject if an error occurred when trying to connect to MongoDB
      .on('error', (error) => {
        console.log('Error: connection to DB failed');
        reject(error);
      })
      // Exit Process if there is no longer a Database Connection
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

    // See https://www.mongodb.com/blog/post/serverless-development-with-nodejs-aws-lambda-mongodb-atlas
    // See https://docs.atlas.mongodb.com/best-practices-connecting-to-aws-lambda/
    // https://mongoosejs.com/docs/lambda.html
    if (!cachedMongoConn) {
      cachedMongoConn = mongoose.connect(
        `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0-yu8za.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
        {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
          connectTimeoutMS: 10000,
          bufferCommands: false, // Disable mongoose buffering
          bufferMaxEntries: 0, // and MongoDB driver buffering
        }
      );
    } else {
      console.log('MongoDB: using cached database instance');
      resolve(cachedMongoConn);
    }
  });
}

export { connectDatabase, conn as connectDev };
