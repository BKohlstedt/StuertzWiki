import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function verifyToken(req, res, next) {
  const token = req.cookies.token;
  console.log("Cookies im Request:", req.cookies);

  if (!token) {
    console.log("Kein Token gefunden.");
    return res.status(401).json({ message: "Kein Token vorhanden" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token validiert:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("Token ungültig:", err.message);
    return res.status(401).json({ message: "Ungültiger Token" });
  }
}

/*
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function verifyToken(req, res, next) {
  console.log("Cookies im Request:", req.cookies);
  const token = req.cookies.token;
  if (!token) {
    console.log("Kein Token gefunden.");
    return res.status(401).json({ message: "Kein Token vorhanden" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token validiert:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("Token ungültig:", err.message);
    return res.status(401).json({ message: "Ungültiger Token" });
  }
}
*/