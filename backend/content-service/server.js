import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import jwt from "jsonwebtoken";
import { graphqlUploadExpress } from "graphql-upload";
import fs from "fs";
import path from "path";

import typeDefs from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers.js";

const app = express();

app.use(cors({
  origin: false,
  credentials: true,
}));

app.use(cookieParser());

// Upload Middleware mit max 10 MB und max 10 Dateien
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

app.use(express.json());

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    const token = req.cookies.token || "";
    if (!token) return { user: null };

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded.id) {
        throw new Error("Token enthält keine User-ID");
      }
      return {
        user: {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role.toUpperCase(),
          permissions: decoded.permissions || [],
        },
      };
    } catch (err) {
      console.error("JWT Fehler:", err.message);
      return { user: null };
    }
  },
  uploads: false, // deaktiviert, da Middleware genutzt wird
});

await server.start();

server.applyMiddleware({
  app,
  path: "/graphql",
  cors: false,
});

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use("/uploads", express.static(uploadDir));

app.listen(4000, () => {
  console.log("Content-Service läuft auf http://localhost:4000/graphql");
});
