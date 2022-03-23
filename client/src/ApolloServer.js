import React from "react";
import App from "./App";
import {
  ApolloClient,
  InMemoryCache, //caching
  ApolloProvider,
  HttpLink,
} from "@apollo/client";

// const httpLink = HttpLink({
//   uri: "http://localhost:5000",
// });

//you can add onError from the apollo/client in order to ge the classified error { graphQLErrors, networkError }
//for this import { onError } from "@apollo/client/link/error";

const client = new ApolloClient({
  //   link: httpLink,
  uri: "http://localhost:5000/graphql",
  cache: new InMemoryCache(),
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
