//setting up the Apollo client
import {
  ApolloClient,
  InMemoryCache, //caching
} from "@apollo/client";

//creating the client instance
export const client = new ApolloClient({
  //   link: httpLink,
  uri: "http://localhost:5000/graphql",
  cache: new InMemoryCache(),
});
