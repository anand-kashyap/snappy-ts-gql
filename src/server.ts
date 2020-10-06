import { ApolloServer, Config, gql } from 'apollo-server';
import { ApolloServer as ApolloServerLambda } from 'apollo-server-lambda';
import { readFileSync } from 'fs';
import { connectDev } from './db';
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
  configObject.debug = false;
  return new ApolloServerLambda(configObject);
}

function createLocalServer() {
  connectDev();
  return new ApolloServer(configObject);
}

export { createLambdaServer, createLocalServer };
