import { ApolloServer, Config, gql } from 'apollo-server';
import { ApolloServer as ApolloServerLambda } from 'apollo-server-lambda';

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hi! Love from @stemmlerjs 🤠.',
  },
};

const configObject: Config = {
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
};

function createLambdaServer() {
  return new ApolloServerLambda(configObject);
}

function createLocalServer() {
  return new ApolloServer(configObject);
}

export { createLambdaServer, createLocalServer };
