import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Label, Card, Image, Popup } from "semantic-ui-react";
import moment from "moment";
import { useApolloClient } from "@apollo/client";
import { GET_POSTS } from "../utils/graphqlQuery";

//get the context
import { AuthContext } from "../context/auth";

import LikeComponent from "./LikeComponent";
import DeleteComponent from "./DeleteComponent";
import MyPopup from "../utils/MyPopup";

function PostCard({
  post: {
    body,
    username,
    likesCount,
    commentCount,
    id,
    likes,
    comments,
    createdAt,
  },
}) {
  const { user } = useContext(AuthContext);

  const client = useApolloClient();
  const postData = client.readQuery({
    query: GET_POSTS,
  });
  var posts = postData?.getPosts;
  posts = posts.filter((post) => (post.username === username ? true : false));
  // console.log("post", posts);
  const popupDetails = {
    username,
    posts,
  };

  return (
    <Card fluid>
      <Card.Content>
        <MyPopup content={popupDetails}>
          <Image
            style={{ cursor: "pointer" }}
            floated="right"
            size="mini"
            src="https://react.semantic-ui.com/images/avatar/large/daniel.jpg"
          />
        </MyPopup>
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow()}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeComponent user={user} likeDetails={{ id, likes, likesCount }} />
        <Popup
          content="Comment on post"
          inverted
          trigger={
            <Button as="div" labelPosition="right">
              <Button
                color={user ? "blue" : "grey"}
                basic
                as={Link}
                to={`/posts/${id}`}
              >
                <Icon name="comments" />
              </Button>
              <Label
                color={user ? "blue" : "grey"}
                as="a"
                basic
                pointing="left"
              >
                {commentCount}
              </Label>
            </Button>
          }
        />

        {user && user.username === username && <DeleteComponent postId={id} />}
      </Card.Content>
    </Card>
  );
}

export default PostCard;
