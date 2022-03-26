//setting up the Apollo client
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache, //caching
} from "@apollo/client";

//auth context for mutations
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "https://powerful-spire-05323.herokuapp.com/graphql",
});

//setContext takes a function with 2 params req, prev data if req since we dont need any of theese`
const authLink = setContext(() => {
  const token = localStorage.getItem("jwtToken");

  //graphql accepts token in form of ->  { Authorization:  Bearer 'token' }
  return {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };
});

//creating the client instance
export const client = new ApolloClient({
  //   link: 'http://localhost:5000/graphql',
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
