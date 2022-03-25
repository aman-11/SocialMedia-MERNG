import React, { useEffect, useState } from "react";
import { Button, Icon, Label } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router";

function LikeComponent({ user, likeDetails: { id, likes, likesCount } }) {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      //logged in user has liked this post
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]);

  const [likeOnPost] = useMutation(LIKE_ON_POST, {
    variables: { postId: id },
  });

  //done for ui changes and auth user
  const likeButton = user ? (
    liked ? (
      //liked -> so icon filled
      <Button color="red" onClick={likeOnPost}>
        <Icon name="heart" />
      </Button>
    ) : (
      //not liked it -> so icon oyutline
      <Button color="red" basic onClick={likeOnPost}>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button as="Link" onClick={() => navigate("/login")} color="grey" basic>
      <Icon name="heart" />
    </Button>
  );

  return (
    <Button as="div" labelPosition="right">
      {likeButton}
      <Label as="a" basic color={user ? "red" : "grey"} pointing="left">
        {likesCount}
      </Label>
    </Button>
  );
}

const LIKE_ON_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        username
        id
      }
      likesCount
    }
  }
`;

export default LikeComponent;

//wonder how it is updating the cache in apollo client after mutation as we have not used any proxy
//1. in mutation we have used id to update like for post
//2. after mutation happens for likPost its return type is Post
//3. when Post is returned the apollo gets the id and check if Post is there in cache it automatically updatees it withput writing query
