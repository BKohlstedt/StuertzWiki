import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const roles = ["admin", "superuser", "user"];

const permissions = [
  { key: "manage_users", description: "Benutzer verwalten" },
  { key: "manage_content", description: "Inhalte verwalten" },
  { key: "invite_users", description: "Benutzer einladen" },
  { key: "manage_permissions", description: "Berechtigungen verwalten" },
  { key: "view_dashboard", description: "Dashboard ansehen" },
];

const users = [
  { email: "admin@stuertz.de", password: "123", role: "admin" },
  { email: "superuser@stuertz.de", password: "123", role: "superuser" },
  { email: "user@stuertz.de", password: "123", role: "user" },
];

async function main() {
  await prisma.rolePermission.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.permission.deleteMany();

  for (const perm of permissions) {
    await prisma.permission.create({ data: perm });
  }

  for (const role of roles) {
    await prisma.role.create({ data: { name: role } });
  }

  const allPermissions = await prisma.permission.findMany();
  const adminRole = await prisma.role.findUnique({ where: { name: "admin" } });

  for (const permission of allPermissions) {
    await prisma.rolePermission.create({
      data: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const role = await prisma.role.findUnique({ where: { name: user.role } });

    await prisma.user.create({
      data: {
        email: user.email,
        password_hash: hashedPassword,
        roleId: role.id,
      },
    });
  }

  console.log("Seeding abgeschlossen – Passwörter sind: '123'");
}

main()
  .catch((e) => {
    console.error("Fehler beim Seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
