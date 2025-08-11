import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getAllPermissions,
  createPermission,
  updatePermission,
  deletePermission,
} from "../services/permissionService.js";

const router = express.Router();

router.get("/permissions", verifyToken, async (req, res) => {
  try {
    const permissions = await getAllPermissions();
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Laden der Berechtigungen" });
  }
});

router.post("/permissions", verifyToken, async (req, res) => {
  try {
    const permission = await createPermission(req.body);
    res.status(201).json(permission);
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Erstellen der Berechtigung" });
  }
});

router.put("/permissions/:id", verifyToken, async (req, res) => {
  try {
    const updatedPermission = await updatePermission(req.params.id, req.body);
    res.json(updatedPermission);
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Aktualisieren der Berechtigung" });
  }
});

router.delete("/permissions/:id", verifyToken, async (req, res) => {
  try {
    await deletePermission(req.params.id);
    res.json({ message: "Berechtigung gelöscht" });
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Löschen der Berechtigung" });
  }
});

export default router;
