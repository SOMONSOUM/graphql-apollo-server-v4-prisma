import { ApolloServer } from '@apollo/server';
import express, { Request, Response } from 'express';
import http from 'http';
import { config } from 'dotenv';
import cors from 'cors';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { schema } from './schema';
import { UserService } from '~/modules/users/user.service';
import { verifyToken } from '~/utils/tokens';
import { prisma } from '~/lib/db.server';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

config();
interface MyContext {
  token?: String;
}

interface ExpressContext {
  req: Request;
  res: Response;
}

const PORT = process.env.PORT || 4000;

const ctx = async ({ req, res }: ExpressContext) => {
  let user = null;

  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.includes('Bearer')) {
      throw new Error('Invalid token');
    }

    const authToken = authHeader.replace('Bearer ', '');
    if (authToken) {
      const userId = await verifyToken(authToken);

      if (userId?.uid) {
        user = await UserService.getUserById(prisma, userId?.uid);
      }
    }
    user = user || null;
  } catch (error) {
    user = null;
  }

  return { req, res, user, prisma };
};

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
    host: '0.0.0.0',
  });
  // WebSocketServer start listening.
  const serverCleanup = useServer({ schema }, wsServer);
  const server = new ApolloServer<MyContext>({
    schema,
    csrfPrevention: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
    introspection: process.env.NODE_ENV !== 'production',
  });

  await server.start();
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: ctx,
    }),
  );
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve),
  );
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
}

startApolloServer();
