import { ApolloClient, InMemoryCache } from "@apollo/client";

export const apolloClient = new ApolloClient({
  uri: process.env.REACT_APP_HASURA_URI,
  cache: new InMemoryCache(),
  headers: {
    "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET
  },
});
