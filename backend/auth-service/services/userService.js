import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function getAllUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: {
        select: {
          id: true,
          name: true,
          permissions: {
            select: {
              permission: {
                select: {
                  id: true,
                  key: true,
                  description: true
                }
              }
            }
          }
        }
      }
    }
  });
}

export async function createUser(data) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return await prisma.user.create({
    data: {
      email: data.email,
      password_hash: hashedPassword,
      roleId: data.roleId
    }
  });
}

export async function updateUser(id, data) {
  const updateData = {};

  if (data.email !== undefined) {
    updateData.email = data.email;
  }

  if (data.roleId !== undefined) {
    updateData.roleId = Number(data.roleId);
  }

  if (data.password) {
    updateData.password_hash = await bcrypt.hash(data.password, 10);
  }

  return await prisma.user.update({
    where: { id: Number(id) },
    data: updateData,
  });
}

export async function deleteUser(id) {
  return await prisma.user.delete({
    where: { id: Number(id) }
  });
}
