import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false,       // Im Prod. auf true mit https stellen
  sameSite: "lax",     // "lax" für localhost, sonst "none" + secure:true
  path: "/",           // Wichtig für Cookie-Löschen
  maxAge: 3600000      // 1 Stunde
};

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      role: {
        include: {
          permissions: { include: { permission: true } }
        }
      }
    }
  });

  if (!user) return res.status(401).json({ message: "Benutzer nicht gefunden" });
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ message: "Ungültiges Passwort" });

  const permissions = user.role.permissions.map(p => p.permission.key);

  const token = jwt.sign(
    { email: user.email, role: user.role.name, permissions },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.cookie("token", token, COOKIE_OPTIONS);

  setTimeout(() => {
    res.json({ message: "Login erfolgreich" });
  }, 850);
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", COOKIE_OPTIONS);
  res.json({ message: "Logout erfolgreich" });
});

router.get("/profile", verifyToken, async (req, res) => {
  res.json({
    user: {
      email: req.user.email,
      role: req.user.role,
      permissions: req.user.permissions,
    },
  });
});

export default router;
