import { ApolloServer, Config, gql } from 'apollo-server';
import { ApolloServer as ApolloServerLambda } from 'apollo-server-lambda';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as Mutation from './mutation';
import * as Query from './query';

const resolvers = {
  Query,
  Mutation,
};

const configObject: Config = {
  typeDefs: gql(readFileSync(require.resolve('./schema.gql'), 'utf8')),
  resolvers,
  introspection: true,
  playground: true,
};

function createLambdaServer() {
  configObject.typeDefs = gql(
    readFileSync(
      join(process.env.LAMBDA_TASK_ROOT, 'bundle', 'schema.gql'),
      'utf8'
    )
  );
  return new ApolloServerLambda(configObject);
}

function createLocalServer() {
  return new ApolloServer(configObject);
}

export { createLambdaServer, createLocalServer };
