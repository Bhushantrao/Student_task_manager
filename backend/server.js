// Express Server setup with Apollo GraphQL Server
// Provides /graphql endpoint for queries and mutations

import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './resolvers/taskResolvers.js';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 5000;

  // Initialize Apollo GraphQL Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Start the GraphQL server before applying Express middleware
  await server.start();

  // Enable Cross-Origin Resource Sharing (CORS) for React frontend
  app.use(cors());

  // Parse incoming JSON request bodies
  app.use(express.json());

  // Mount GraphQL middleware on /graphql route
  app.use('/graphql', expressMiddleware(server));

  // Welcome / Health check route
  app.get('/', (req, res) => {
    res.json({
      message: 'Student Task Manager GraphQL Backend is running successfully!',
      graphqlEndpoint: `http://localhost:${PORT}/graphql`,
      status: 'active'
    });
  });

  // Start listening on specified port
  app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`🚀 Backend Server running at http://localhost:${PORT}`);
    console.log(`📡 GraphQL API Endpoint:   http://localhost:${PORT}/graphql`);
    console.log(`===================================================`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
});

