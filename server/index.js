const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const http = require("http");
const cors = require("cors");

const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");

//typeDefs, resolvers
const { makeExecutableSchema } = require("@graphql-tools/schema");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/indexResolve");

//DB
const { MONGODB } = require("./config.js");
const mongoose = require("mongoose");

(async function startApolloServer(typeDefs, resolvers) {
  // Required logic for integrating with Express

  const app = express();
  const httpServer = http.createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  //   const pubsub = new PubSub();
  var corsOptions = {
    origin: "*",
    credentials: true,
  };
  app.use(cors(corsOptions));

  // Same ApolloServer initialization as before, plus the drain plugin.
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });
  const serverCleanup = useServer({ schema }, wsServer);

  // Set up ApolloServer.
  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({ req }),
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Proper shutdown for the WebSocket server.
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
  });

  await server.start();
  server.applyMiddleware({
    app,
    cors: false,
  });

  const PORT = process.env.PORT || 5000;

  mongoose
    .connect(MONGODB, { useNewUrlParser: true })
    .then(async () => {
      console.log("db connected successfully");
      await new Promise((resolve) =>
        httpServer.listen({ port: PORT }, resolve)
      );
      console.log(
        `🚀 Server ready at http://localhost:5000${server.graphqlPath}`
      );
    })
    .catch((error) => {
      console.error("error in connecting database", error);
    });
})(typeDefs, resolvers);
//
