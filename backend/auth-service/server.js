import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import roleRoutes from "./routes/roles.js";
import rolePermissionsRoutes from "./routes/rolePermissions.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: false,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", roleRoutes);
app.use("/api", rolePermissionsRoutes);

app.listen(3001, () => {
  console.log("Auth-Service läuft auf http://localhost:3001");
});
