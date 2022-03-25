import { gql, useQuery } from "@apollo/client";
import moment from "moment";
import React, { useContext } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { Button, Card, Grid, Icon, Image, Label } from "semantic-ui-react";
import DeleteComponent from "../components/DeleteComponent";
import LikeComponent from "../components/LikeComponent";
import { AuthContext } from "../context/auth";

function ViewPost() {
  const { user } = useContext(AuthContext);
  const naviagte = useNavigate();
  const { postId } = useParams();
  console.log("post -id", postId);
  const { data } = useQuery(FETCH_POST_BY_QUERY, {
    variables: {
      postId,
    },
  });

  const post = data?.getPost;
  //console.log("getpost", post);

  const afterDeletePostCallback = () => {
    naviagte("/");
  };

  let postDisplay;
  if (!post) {
    postDisplay = <p>Loading post...</p>;
  } else {
    const postLikeDetails = {
      id: post.id,
      likes: post.likes,
      likesCount: post.likesCount,
    };
    postDisplay = (
      <Grid style={{ marginTop: 20 }}>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              floated="right"
              size="small"
              src="https://react.semantic-ui.com/images/avatar/large/daniel.jpg"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{post.username}</Card.Header>
                <Card.Meta>{moment(post.createdAt).fromNow()}</Card.Meta>
                <Card.Description>{post.body}</Card.Description>
              </Card.Content>

              <hr />
              <Card.Content>
                <LikeComponent user={user} likeDetails={postLikeDetails} />
                <Button
                  as="div"
                  labelPosition="right"
                  onClick={() => console.log("comment on post")}
                >
                  <Button basic color="blue">
                    <Icon name="comments" />
                  </Button>
                  <Label basic color="blue" position="left">
                    {post.commentCount}
                  </Label>
                </Button>
                {user && user.username === post.username && (
                  <DeleteComponent
                    postId={postId}
                    callback={afterDeletePostCallback}
                  />
                )}
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postDisplay;
}

const FETCH_POST_BY_QUERY = gql`
  query GetPost($postId: ID!) {
    getPost(postId: $postId) {
      comments {
        username
        body
      }
      likesCount
      commentCount
      body
      username
      id
      createdAt
      likes {
        username
        createdAt
        id
      }
    }
  }
`;

export default ViewPost;
