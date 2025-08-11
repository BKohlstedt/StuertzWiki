import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // <- auch hier sicherstellen!

export function verifyToken(req, res, next) {
  const token = req.cookies.token;
  console.log("Cookies im Request:", req.cookies);

  if (!token) {
    console.log("Kein Token gefunden.");
    return res.status(401).json({ message: "Kein Token vorhanden" });
  }

  try {
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET ist nicht gesetzt!");
      return res.status(500).json({ message: "Serverkonfiguration fehlerhaft" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token validiert:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("JWT Verify Error:", err.message);
    return res.status(401).json({ message: "Ungültiger Token" });
  }
}
