import { gql } from "apollo-server-express";

const typeDefs = gql`
  # User-Rollen
  enum RoleName {
    ADMIN
    SUPERUSER
    USER
  }

  # Department (Abteilung)
  type Department {
    id: ID!
    title: String!
    imageUrl: String
    isLocked: Boolean!
    createdAt: String!
    updatedAt: String!
    pages: [Page!]!
  }

  # Page (Indexseite pro Abteilung)
  type Page {
    id: ID!
    departmentId: Int!
    title: String!
    slug: String!
    imageUrl: String
    isLocked: Boolean!
    createdAt: String!
    updatedAt: String!
    department: Department!
    topics: [Topic!]!
  }

  # Topic (Thema auf einer Page)
  type Topic {
    id: ID!
    pageId: Int!
    title: String!
    imageUrl: String
    isLocked: Boolean!
    createdAt: String!
    updatedAt: String!
    page: Page!
    posts: [Post!]!
  }

  # Post (Beiträge zu einem Thema)
  type Post {
    id: ID!
    topicId: Int!
    authorId: Int!
    content: String!
    images: [String!]
    files: [String!]
    createdAt: String!
    updatedAt: String!
    approved: Boolean!
    topic: Topic!
    author: User!
  }

  # User
  type User {
    id: ID!
    email: String!
    role: String!
    posts: [Post!]!
  }

  # Query Root
  type Query {
    departments: [Department!]!
    department(id: ID!): Department
    pagesByDepartment(departmentId: Int!): [Page!]!
    topicsByPage(pageId: Int!): [Topic!]!
    postsByTopic(topicId: Int!): [Post!]!
  }

  # Input Typen für Mutations
  input CreateDepartmentInput {
    title: String!
    imageUrl: String
    isLocked: Boolean
  }

  input UpdateDepartmentInput {
    title: String
    imageUrl: String
    isLocked: Boolean
  }

  input CreatePageInput {
    departmentId: Int!
    title: String!
    slug: String!
    imageUrl: String
    isLocked: Boolean
  }

  input UpdatePageInput {
    title: String
    slug: String
    imageUrl: String
    isLocked: Boolean
  }

  input CreateTopicInput {
    pageId: Int!
    title: String!
    imageUrl: String
    isLocked: Boolean
  }

  input UpdateTopicInput {
    title: String
    imageUrl: String
    isLocked: Boolean
  }

  input CreatePostInput {
    topicId: Int!
    content: String!
    images: [String!]
    files: [String!]
    approved: Boolean
  }

  input UpdatePostInput {
    content: String
    images: [String!]
    files: [String!]
    approved: Boolean
  }

  # Mutation Root
  type Mutation {
    createDepartment(input: CreateDepartmentInput!): Department!
    updateDepartment(id: ID!, input: UpdateDepartmentInput!): Department!
    deleteDepartment(id: ID!): Boolean!

    createPage(input: CreatePageInput!): Page!
    updatePage(id: ID!, input: UpdatePageInput!): Page!
    deletePage(id: ID!): Boolean!

    createTopic(input: CreateTopicInput!): Topic!
    updateTopic(id: ID!, input: UpdateTopicInput!): Topic!
    deleteTopic(id: ID!): Boolean!

    createPost(input: CreatePostInput!): Post!
    updatePost(id: ID!, input: UpdatePostInput!): Post!
    deletePost(id: ID!): Boolean!
  }
`;

export default typeDefs;
