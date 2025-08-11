import express from "express";
import { getAllUsers, createUser, updateUser, deleteUser } from "../services/userService.js";
import { verifyToken } from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/users", verifyToken, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Abrufen der Benutzer" });
  }
});

router.post("/users", verifyToken, async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Erstellen des Benutzers" });
  }
});

router.put("/users/:id", verifyToken, async (req, res) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Aktualisieren des Benutzers" });
  }
});

router.delete("/users/:id", verifyToken, async (req, res) => {
  try {
    await deleteUser(req.params.id);
    res.json({ message: "Benutzer gelöscht" });
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Löschen des Benutzers" });
  }
});

export default router;
