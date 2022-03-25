import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button, Confirm, Icon } from "semantic-ui-react";

//query
import { GET_POSTS } from "../utils/graphqlQuery";

function DeleteComponent({ postId, commentId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const queryType = commentId ? DELETE_COMMENT : DELETE_POST;

  const [performDelete] = useMutation(queryType, {
    variables: { postId, commentId },
    update(proxy) {
      setConfirmOpen(false);

      //conditiona; update of cache after post -> on delete action
      if (!commentId) {
        //TODO --> remove from Cache
        const data = proxy.readQuery({
          query: GET_POSTS,
        });
        //make copy as cache is read only
        let newData = { ...data };
        //filter out the post from the array of old posts
        newData.getPosts = newData.getPosts.filter(
          (post) => post.id !== postId
        );
        console.log("newData", newData);
        //write query
        proxy.writeQuery({
          query: GET_POSTS,
          data: {
            getPosts: [...newData.getPosts],
          },
        });
      }

      //case when postCard delete happens so check callback is passed or not
      if (callback) callback();
    },
  });

  return (
    <>
      <Button
        as="div"
        color="red"
        floated="right"
        onClick={() => setConfirmOpen(true)}
      >
        <Icon name="trash" style={{ margin: 0 }} />
      </Button>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={performDelete}
      />
    </>
  );
}

const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT = gql`
  mutation DeleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      body
      createdAt
      username
      likes {
        username
        createdAt
        id
      }
      comments {
        id
        username
        body
        createdAt
      }
      likesCount
      commentCount
    }
  }
`;

export default DeleteComponent;
