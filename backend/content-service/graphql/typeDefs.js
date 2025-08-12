import { gql } from "apollo-server-express";

const typeDefs = gql`
  enum RoleName {
    ADMIN
    SUPERUSER
    USER
  }

  type Department {
    id: ID!
    title: String!
    imageUrl: String
    isLocked: Boolean!
    createdAt: String!
    updatedAt: String!
    pages: [Page!]!
  }

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

  type File {
    id: ID!
    postId: Int!
    filename: String!
    description: String
    url: String!
  }

  type Post {
    id: ID!
    topicId: Int!
    authorId: Int!
    title: String!
    shortDescription: String
    content: String!
    images: [String!]
    files: [File!]!
    createdAt: String!
    updatedAt: String!
    approved: Boolean!
    topic: Topic!
    author: User!
  }

  type User {
    id: ID!
    email: String!
    role: String!
    posts: [Post!]!
  }

  type Query {
    departments(isLocked: Boolean): [Department!]!
    department(id: ID!): Department
    pagesByDepartment(departmentId: Int!): [Page!]!
    page(id: ID!): Page
    topicsByPage(pageId: Int!): [Topic!]!
    topic(id: ID!): Topic
    postsByTopic(topicId: Int!): [Post!]!
  }

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

  input CreateFileInput {
    filename: String!
    description: String
    url: String!
  }

  input CreatePostInput {
    topicId: Int!
    title: String!
    shortDescription: String
    content: String!
    images: [String!]
    files: [CreateFileInput!]
    approved: Boolean
  }

  input UpdatePostInput {
    title: String
    shortDescription: String
    content: String
    images: [String!]
    files: [CreateFileInput!]
    approved: Boolean
  }

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
