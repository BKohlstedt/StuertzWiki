import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/roles", verifyToken, async (req, res) => {
  try {
    const roles = await prisma.role.findMany();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Laden der Rollen" });
  }
});

router.post("/roles", verifyToken, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Rollenname ist erforderlich" });
  }

  try {
    const existingRole = await prisma.role.findUnique({ where: { name } });
    if (existingRole) {
      return res.status(409).json({ message: "Rolle existiert bereits" });
    }
    const newRole = await prisma.role.create({ data: { name } });
    res.status(201).json(newRole);
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Erstellen der Rolle" });
  }
});

router.delete("/roles/:id", verifyToken, async (req, res) => {
  const roleId = Number(req.params.id);

  try {
    // Prüfe, ob die Rolle noch Benutzern zugewiesen ist
    const assignedUsersCount = await prisma.user.count({ where: { roleId } });

    if (assignedUsersCount > 0) {
      return res.status(400).json({
        message:
          "Diese Rolle wird im System verwendet. Entfernen Sie erst alle Benutzer mit dieser Rolle!",
      });
    }

    await prisma.role.delete({ where: { id: roleId } });
    res.json({ message: "Rolle erfolgreich gelöscht" });
  } catch (err) {
    console.error("Fehler beim Löschen der Rolle:", err);
    res.status(500).json({ message: "Fehler beim Löschen der Rolle" });
  }
});

export default router;
