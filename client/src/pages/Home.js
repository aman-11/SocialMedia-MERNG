import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Grid } from "semantic-ui-react";
import PostCard from "../components/PostCard";

function Home() {
  const { loading, error, data } = useQuery(GET_POSTS);
  const posts = data?.getPosts;

  if (error) return `Error! ${error.message}`;

  return (
    <Grid columns={3} divided>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <h1>Loading posts....</h1>
        ) : (
          posts &&
          posts.map((post) => (
            <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
              <PostCard post={post} />
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  );
}

const GET_POSTS = gql`
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

export default Home;
