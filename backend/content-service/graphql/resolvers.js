import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const checkRole = (user, allowedRoles) => {
  if (!user || !user.role || !allowedRoles.includes(user.role.toUpperCase())) {
    throw new Error("Zugriff verweigert: keine ausreichenden Rechte.");
  }
};

export const resolvers = {
  Query: {
    departments: async (parent, args, context) => {
      return prisma.department.findMany({
        include: { pages: true },
      });
    },
    department: async (parent, { id }, context) => {
      return prisma.department.findUnique({
        where: { id: Number(id) },
        include: { pages: true },
      });
    },
    pagesByDepartment: async (parent, { departmentId }, context) => {
      return prisma.page.findMany({
        where: { departmentId: Number(departmentId) },
        include: { topics: true },
      });
    },
    topicsByPage: async (parent, { pageId }, context) => {
      return prisma.topic.findMany({
        where: { pageId: Number(pageId) },
        include: { posts: true },
      });
    },
    postsByTopic: async (parent, { topicId }, context) => {
      return prisma.post.findMany({
        where: { topicId: Number(topicId) },
        include: { author: true, topic: true },
      });
    },
  },

  Mutation: {
    // Admin & Superuser dürfen Departments verwalten
    createDepartment: async (parent, { input }, context) => {
      checkRole(context.user, ["ADMIN", "SUPERUSER"]);
      return prisma.department.create({
        data: input,
      });
    },
    updateDepartment: async (parent, { id, input }, context) => {
      checkRole(context.user, ["ADMIN", "SUPERUSER"]);
      return prisma.department.update({
        where: { id: Number(id) },
        data: input,
      });
    },
    deleteDepartment: async (parent, { id }, context) => {
      checkRole(context.user, ["ADMIN", "SUPERUSER"]);
      await prisma.department.delete({ where: { id: Number(id) } });
      return true;
    },

    // Admin & Superuser für Pages (Indexseiten)
    createPage: async (parent, { input }, context) => {
      checkRole(context.user, ["ADMIN", "SUPERUSER"]);
      return prisma.page.create({
        data: input,
      });
    },
    updatePage: async (parent, { id, input }, context) => {
      checkRole(context.user, ["ADMIN", "SUPERUSER"]);
      return prisma.page.update({
        where: { id: Number(id) },
        data: input,
      });
    },
    deletePage: async (parent, { id }, context) => {
      checkRole(context.user, ["ADMIN", "SUPERUSER"]);
      await prisma.page.delete({ where: { id: Number(id) } });
      return true;
    },

    // Admin & Superuser für Topics
    createTopic: async (parent, { input }, context) => {
      checkRole(context.user, ["ADMIN", "SUPERUSER"]);
      return prisma.topic.create({
        data: input,
      });
    },
    updateTopic: async (parent, { id, input }, context) => {
      checkRole(context.user, ["ADMIN", "SUPERUSER"]);
      return prisma.topic.update({
        where: { id: Number(id) },
        data: input,
      });
    },
    deleteTopic: async (parent, { id }, context) => {
      checkRole(context.user, ["ADMIN", "SUPERUSER"]);
      await prisma.topic.delete({ where: { id: Number(id) } });
      return true;
    },

    // Posts können von Superuser & User erstellt werden, aber Topic muss offen sein
    createPost: async (parent, { input }, context) => {
      checkRole(context.user, ["SUPERUSER", "USER"]);

      const topic = await prisma.topic.findUnique({
        where: { id: Number(input.topicId) },
      });
      if (!topic) throw new Error("Thema nicht gefunden.");
      if (topic.isLocked) throw new Error("Thema ist gesperrt.");

      return prisma.post.create({
        data: {
          content: input.content,
          images: input.images || [],
          files: input.files || [],
          topicId: Number(input.topicId),
          authorId: context.user.id,
          approved: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    },
    updatePost: async (parent, { id, input }, context) => {
      checkRole(context.user, ["ADMIN", "SUPERUSER"]);
      return prisma.post.update({
        where: { id: Number(id) },
        data: input,
      });
    },
    deletePost: async (parent, { id }, context) => {
      checkRole(context.user, ["ADMIN", "SUPERUSER"]);
      await prisma.post.delete({ where: { id: Number(id) } });
      return true;
    },
  },

  Department: {
    pages: (parent) => {
      return prisma.page.findMany({ where: { departmentId: parent.id } });
    },
  },
  Page: {
    department: (parent) => {
      return prisma.department.findUnique({ where: { id: parent.departmentId } });
    },
    topics: (parent) => {
      return prisma.topic.findMany({ where: { pageId: parent.id } });
    },
  },
  Topic: {
    page: (parent) => {
      return prisma.page.findUnique({ where: { id: parent.pageId } });
    },
    posts: (parent) => {
      return prisma.post.findMany({ where: { topicId: parent.id } });
    },
  },
  Post: {
    topic: (parent) => {
      return prisma.topic.findUnique({ where: { id: parent.topicId } });
    },
    author: (parent) => {
      return prisma.user.findUnique({ where: { id: parent.authorId } });
    },
  },
  User: {
    posts: (parent) => {
      return prisma.post.findMany({ where: { authorId: parent.id } });
    },
  },
};
