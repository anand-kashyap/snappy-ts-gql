// ! run 'mongod' command on terminal & yarn test:start before running tests

import { request, should, use } from 'chai';
import chaiHttp from 'chai-http';
import { before } from 'mocha';
import mongoose from 'mongoose';

use(chaiHttp);

const req = () => request('http://localhost:4000').post('/graphql');

before(async () => {
  // empties all collections
  await mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.drop();
  }
  await mongoose.connection.close();
});

export { req as request, should };
