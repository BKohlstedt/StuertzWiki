import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import prisma from "../prisma/client.js";

const router = express.Router();

router.get("/roles-permissions", verifyToken, async (req, res) => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    const permissions = await prisma.permission.findMany();

    const formattedRoles = roles.map((role) => ({
      id: role.id,
      name: role.name,
      permissions: role.permissions.map((rp) => rp.permission.key),
    }));

    res.json({ roles: formattedRoles, allPermissions: permissions });
  } catch (error) {
    console.error("Fehler beim Abrufen der Rollen-Berechtigungen:", error);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
});

router.put("/roles/:roleId/permissions", verifyToken, async (req, res) => {
  const roleId = parseInt(req.params.roleId, 10);
  const { permissions } = req.body; // Array von permission keys

  try {
    // Alte Berechtigungen löschen
    await prisma.rolePermission.deleteMany({ where: { roleId } });

    // Hole alle permissions aus DB anhand keys
    const dbPermissions = await prisma.permission.findMany({
      where: { key: { in: permissions } }
    });

    // Erstelle Verbindungen mit permissionId und roleId
    const createPromises = dbPermissions.map((perm) =>
      prisma.rolePermission.create({
        data: {
          roleId,
          permissionId: perm.id,
        },
      })
    );

    await Promise.all(createPromises);

    res.json({ message: "Berechtigungen erfolgreich aktualisiert" });
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Berechtigungen:", error);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
});


export default router;
