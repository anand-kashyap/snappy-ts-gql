import { createLambdaServer } from './server';

const graphQLServer = createLambdaServer();

const handler = graphQLServer.createHandler({
  cors: {
    origin: '*',
  },
});
export { handler };
