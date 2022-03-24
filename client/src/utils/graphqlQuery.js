import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query getPosts {
    getPosts {
      body
      username
      likesCount
      commentCount
      id
      likes {
        username
      }
      comments {
        username
        body
        id
        createdAt
      }
      createdAt
    }
  }
`;
