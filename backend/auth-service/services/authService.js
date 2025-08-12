import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../prisma/client.js';

const JWT_SECRET = process.env.JWT_SECRET;

export async function authenticateUser(email, password) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });

  if (!user) return null;

  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) return null;

  const token = jwt.sign(
    {
      id: user.id,         // Wichtig: ID hier mitschicken
      email: user.email,
      role: user.role.name,
      permissions: user.role.permissions.map((rp) => rp.permission.key),
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { token, user: { id: user.id, email: user.email, role: user.role.name } };
}
