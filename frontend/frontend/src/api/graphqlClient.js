// src/api/graphqlClient.js
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const httpLink = createHttpLink({
  uri: "/graphql",  // statt http://localhost:4000/graphql
  credentials: "include", // sehr wichtig für Cookie-Auth
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
