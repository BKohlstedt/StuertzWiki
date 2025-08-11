import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import jwt from "jsonwebtoken";

import typeDefs from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",  // Frontend
  credentials: true,                 // Wichtig für Cookies
}));

app.use(cookieParser());
app.use(express.json());

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    const token = req.cookies.token || "";
    if (!token) return { user: null };
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return { user: decoded };
    } catch {
      return { user: null };
    }
  },
});

await server.start();

server.applyMiddleware({
  app,
  path: "/graphql",
  cors: false,  // Express übernimmt CORS komplett
});

app.listen(4000, () => {
  console.log("Content-Service läuft auf http://localhost:4000/graphql");
});
