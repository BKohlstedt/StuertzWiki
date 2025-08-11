import express from "express";
import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

import typeDefs from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers.js";
import prisma from "./prisma/client.js";

dotenv.config();

async function startServer() {
  const app = express();

  app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));

  app.use(cookieParser());
  app.use(express.json());

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      const token = req.cookies.token || "";

      if (!token) return { prisma, user: null };

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { prisma, user: decoded };
      } catch (error) {
        console.log("JWT Verify Error:", error.message);
        return { prisma, user: null };
      }
    },
  });

  await server.start();

  server.applyMiddleware({ app, path: "/graphql", cors: false });

  app.listen(4000, () => {
    console.log("Content-Service läuft auf http://localhost:4000/graphql");
  });
}

startServer();
