import React from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Label, Card, Image } from "semantic-ui-react";
import moment from "moment";

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
  const likeOnPost = () => {
    console.log("you have liked this post");
  };

  const commentOnPost = () => {
    console.log("you have liked this post");
  };

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
        <Button as="div" labelPosition="right">
          <Button color="red" basic onClick={likeOnPost}>
            <Icon name="heart" />
          </Button>
          <Label as="a" basic color="red" pointing="left">
            {likesCount}
          </Label>
        </Button>
        <Button as="div" labelPosition="right">
          <Button color="blue" basic onClick={commentOnPost}>
            <Icon name="comments" />
          </Button>
          <Label as="a" basic color="blue" pointing="left">
            {commentCount}
          </Label>
        </Button>
      </Card.Content>
    </Card>
  );
}

export default PostCard;
