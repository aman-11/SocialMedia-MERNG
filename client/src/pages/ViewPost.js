import React, { useContext, useRef, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import moment from "moment";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Form,
  Grid,
  Icon,
  Image,
  Label,
} from "semantic-ui-react";
import DeleteComponent from "../components/DeleteComponent";
import LikeComponent from "../components/LikeComponent";
import { AuthContext } from "../context/auth";

function ViewPost() {
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState("");
  const naviagte = useNavigate();
  const { postId } = useParams();
  //   console.log("post -id", postId);
  const commentInputRef = useRef(null);

  const { data } = useQuery(FETCH_POST_BY_QUERY, {
    variables: {
      postId,
    },
  });

  const post = data?.getPost;
  //console.log("getpost", post);

  const [createComment] = useMutation(CREATE_COMMENT, {
    variables: {
      postId,
      body: comment,
    },
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
  });

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
    // console.log(post);
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
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment..."
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        className="ui button teal"
                        style={{ marginLeft: 6 }}
                        type="submit"
                        disabled={comment.trim() === ""}
                        onClick={createComment}
                      >
                        Add Comment
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {post.comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteComponent postId={postId} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
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
        id
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

const CREATE_COMMENT = gql`
  mutation CreateComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      commentCount
      body
      id
      createdAt
      username
      comments {
        body
        username
        id
        createdAt
      }
      likes {
        username
        createdAt
        id
      }
      likesCount
    }
  }
`;

export default ViewPost;
