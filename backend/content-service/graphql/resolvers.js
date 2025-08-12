import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const checkRole = (user, allowedRoles) => {
  if (!user || !user.role || !allowedRoles.includes(user.role.toUpperCase())) {
    throw new Error("Zugriff verweigert: keine ausreichenden Rechte.");
  }
};

export const resolvers = {
  Query: {
    departments: async (parent, { isLocked }, context) => {
      const where = {};
      if (typeof isLocked === "boolean") {
        where.isLocked = isLocked;
      }
      return prisma.department.findMany({
        where,
        include: { pages: true },
      });
    },

    department: async (parent, { id }) => {
      return prisma.department.findUnique({
        where: { id: Number(id) },
        include: { pages: true },
      });
    },

    pagesByDepartment: async (parent, { departmentId }) => {
      return prisma.page.findMany({
        where: { departmentId: Number(departmentId) },
        include: { topics: true },
      });
    },

    page: async (parent, { id }) => {
      return prisma.page.findUnique({
        where: { id: Number(id) },
        include: { department: true, topics: true },
      });
    },

    topicsByPage: async (parent, { pageId }) => {
      return prisma.topic.findMany({
        where: { pageId: Number(pageId) },
        include: { posts: true },
      });
    },

    topic: async (parent, { id }) => {
      return prisma.topic.findUnique({
        where: { id: Number(id) },
        include: {
          posts: {
            include: {
              files: true,
              author: true,
            },
          },
          page: true,
        },
      });
    },

    postsByTopic: async (parent, { topicId }) => {
      return prisma.post.findMany({
        where: { topicId: Number(topicId) },
        include: { author: true, topic: true, files: true },
      });
    },
  },

  Mutation: {
    createDepartment: async (parent, { input }, context) => {
      checkRole(context.user, ["ADMIN", "SUPERUSER"]);
      return prisma.department.create({ data: input });
    },

    updateDepartment: async (parent, { id, input }, context) => {
      checkRole(context.user, ["ADMIN", "SUPERUSER"]);
      return prisma.department.update({ where: { id: Number(id) }, data: input });
    },

    deleteDepartment: async (parent, { id }, context) => {
      checkRole(context.user, ["ADMIN", "SUPERUSER"]);
      await prisma.department.delete({ where: { id: Number(id) } });
      return true;
    },

    createPage: async (parent, { input }, context) => {
      checkRole(context.user, ["ADMIN", "SUPERUSER"]);
      return prisma.page.create({ data: input });
    },

    updatePage: async (parent, { id, input }, context) => {
      checkRole(context.user, ["ADMIN", "SUPERUSER"]);
      return prisma.page.update({ where: { id: Number(id) }, data: input });
    },

    deletePage: async (parent, { id }, context) => {
      checkRole(context.user, ["ADMIN", "SUPERUSER"]);
      await prisma.page.delete({ where: { id: Number(id) } });
      return true;
    },

    createTopic: async (parent, { input }, context) => {
      checkRole(context.user, ["ADMIN", "SUPERUSER"]);
      return prisma.topic.create({ data: input });
    },

    updateTopic: async (parent, { id, input }, context) => {
      checkRole(context.user, ["ADMIN", "SUPERUSER"]);
      return prisma.topic.update({ where: { id: Number(id) }, data: input });
    },

    deleteTopic: async (parent, { id }, context) => {
      checkRole(context.user, ["ADMIN", "SUPERUSER"]);
      await prisma.topic.delete({ where: { id: Number(id) } });
      return true;
    },

    createPost: async (parent, { input }, context) => {
      if (!context.user) throw new Error("Nicht authentifiziert.");

      const { topicId, title, shortDescription, content, images, files } = input;

      const topic = await prisma.topic.findUnique({ where: { id: Number(topicId) } });
      if (!topic) throw new Error("Thema nicht gefunden.");
      if (topic.isLocked) throw new Error("Thema ist gesperrt.");

      return prisma.post.create({
        data: {
          topicId: Number(topicId),
          authorId: context.user.id,
          title,
          shortDescription,
          content,
          images: images || [],
          approved: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          files: files && files.length > 0
            ? {
                create: files.map((file) => ({
                  filename: file.filename,
                  description: file.description || null,
                  url: file.url,
                })),
              }
            : undefined,
        },
        include: {
          files: true,
        },
      });
    },

    updatePost: async (parent, { id, input }, context) => {
      checkRole(context.user, ["ADMIN", "SUPERUSER"]);
      return prisma.post.update({ where: { id: Number(id) }, data: input });
    },

    deletePost: async (parent, { id }, context) => {
      checkRole(context.user, ["ADMIN", "SUPERUSER"]);
      await prisma.post.delete({ where: { id: Number(id) } });
      return true;
    },
  },

  Department: {
    pages: (parent) => prisma.page.findMany({ where: { departmentId: parent.id } }),
  },

  Page: {
    department: (parent) => prisma.department.findUnique({ where: { id: parent.departmentId } }),
    topics: (parent) => prisma.topic.findMany({ where: { pageId: parent.id } }),
  },

  Topic: {
    page: (parent) => prisma.page.findUnique({ where: { id: parent.pageId } }),
    posts: (parent) => prisma.post.findMany({ where: { topicId: parent.id } }),
  },

  Post: {
    topic: (parent) => prisma.topic.findUnique({ where: { id: parent.topicId } }),
    author: (parent) => prisma.user.findUnique({ where: { id: parent.authorId } }),
    files: (parent) => prisma.file.findMany({ where: { postId: parent.id } }),
  },

  User: {
    posts: (parent) => prisma.post.findMany({ where: { authorId: parent.id } }),
  },
};
