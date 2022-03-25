import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Label, Card, Image } from "semantic-ui-react";
import moment from "moment";

//get the context
import { AuthContext } from "../context/auth";
import LikeComponent from "./LikeComponent";
import DeleteComponent from "./DeleteComponent";

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

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/daniel.jpg"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow()}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeComponent user={user} likeDetails={{ id, likes, likesCount }} />

        <Button as="div" labelPosition="right">
          <Button color="blue" basic as={Link} to={`/posts/${id}`}>
            <Icon name="comments" />
          </Button>
          <Label as="a" basic color="blue" pointing="left">
            {commentCount}
          </Label>
        </Button>

        {user && user.username === username && <DeleteComponent postId={id} />}
      </Card.Content>
    </Card>
  );
}

export default PostCard;
