// backend/auth-service/services/permissionService.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllPermissions() {
  return await prisma.permission.findMany();
}

export async function createPermission(data) {
  return await prisma.permission.create({
    data: {
      key: data.key,
      description: data.description,
    },
  });
}

export async function updatePermission(id, data) {
  return await prisma.permission.update({
    where: { id: Number(id) },
    data: {
      key: data.key,
      description: data.description,
    },
  });
}

export async function deletePermission(id) {
  return await prisma.permission.delete({
    where: { id: Number(id) },
  });
}
