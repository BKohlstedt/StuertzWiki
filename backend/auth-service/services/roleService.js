import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getAllRoles() {
  return await prisma.role.findMany({
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });
}

export async function createRole(name, permissionIds) {
  return await prisma.role.create({
    data: {
      name,
      permissions: {
        create: permissionIds.map((id) => ({
          permission: { connect: { id } },
        })),
      },
    },
  });
}

export async function updateRolePermissions(roleId, permissionIds) {
  // Alte Berechtigungen löschen
  await prisma.rolePermission.deleteMany({
    where: { roleId },
  });

  // Neue Berechtigungen setzen
  await prisma.rolePermission.createMany({
    data: permissionIds.map((permissionId) => ({
      roleId,
      permissionId,
    })),
    skipDuplicates: true,
  });
}

export async function deleteRole(roleId) {
  return await prisma.role.delete({
    where: { id: roleId },
  });
}
