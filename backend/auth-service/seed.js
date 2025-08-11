import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const roles = ["admin", "superuser", "user"];

const permissions = [
  { key: "wiki:create", description: "Wiki-Seiten erstellen" },
  { key: "wiki:edit", description: "Wiki-Seiten bearbeiten" },
  { key: "wiki:submit", description: "Wiki-Seiten einreichen" },
  { key: "wiki:approve", description: "Wiki-Seiten freigeben" },
  { key: "wiki:delete", description: "Wiki-Seiten löschen" },
  { key: "wiki:block", description: "Wiki-Seiten sperren" },
  { key: "roles:assign", description: "Rollen zuweisen" },
  { key: "permissions:assign", description: "Berechtigungen zuweisen" },
];

const users = [
  { email: "admin@stuertz.de", password: "123", role: "admin" },
  { email: "superuser@stuertz.de", password: "123", role: "superuser" },
  { email: "user@stuertz.de", password: "123", role: "user" },
];

const rolePermissionsMap = {
  admin: [
    "wiki:create",
    "wiki:edit",
    "wiki:submit",
    "wiki:approve",
    "wiki:delete",
    "wiki:block",
    "roles:assign",
    "permissions:assign",
  ],
  superuser: [
    "wiki:create",
    "wiki:edit",
    "wiki:submit",
    "wiki:approve",
    "wiki:block",
  ],
  user: ["wiki:create", "wiki:submit"],
};

async function main() {
  // Alles bereinigen
  await prisma.rolePermission.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.permission.deleteMany();

  // Berechtigungen erstellen
  for (const perm of permissions) {
    await prisma.permission.create({ data: perm });
  }

  // Rollen + Berechtigungen zuweisen
  for (const roleName of roles) {
    const role = await prisma.role.create({ data: { name: roleName } });

    const keys = rolePermissionsMap[roleName] || [];

    for (const key of keys) {
      const permission = await prisma.permission.findUnique({ where: { key } });

      if (permission) {
        await prisma.rolePermission.create({
          data: {
            roleId: role.id,
            permissionId: permission.id,
          },
        });
      }
    }
  }

  // Benutzer anlegen
  for (const user of users) {
    const hashed = await bcrypt.hash(user.password, 10);
    const role = await prisma.role.findUnique({ where: { name: user.role } });

    await prisma.user.create({
      data: {
        email: user.email,
        password_hash: hashed,
        roleId: role.id,
      },
    });
  }

  console.log("✅ Seeding abgeschlossen – Passwörter sind: '123'");
}

main()
  .catch((e) => {
    console.error("❌ Fehler beim Seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
