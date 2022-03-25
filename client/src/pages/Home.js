import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { Grid, Transition } from "semantic-ui-react";
import PostCard from "../components/PostCard";

//context
import { AuthContext } from "../context/auth";
import PostForm from "../components/PostForm";

//import query from util
import { GET_POSTS } from "../utils/graphqlQuery";

function Home() {
  const { user } = useContext(AuthContext);
  const { loading, error, data } = useQuery(GET_POSTS);
  const posts = data?.getPosts;

  if (error) return `Error! ${error.message}`;

  return (
    <Grid columns={3} divided>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}

        {loading ? (
          <h1>Loading posts....</h1>
        ) : (
          <Transition.Group>
            {posts &&
              posts.map((post) => (
                <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
}

export default Home;
