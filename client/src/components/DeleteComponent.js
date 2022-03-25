import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button, Confirm, Icon } from "semantic-ui-react";

//query
import { GET_POSTS } from "../utils/graphqlQuery";

function DeleteComponent({ postId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [deletePost] = useMutation(DELETE_POST, {
    variables: { postId },
    update(proxy) {
      setConfirmOpen(false);

      //TODO --> remove from Cache
      const data = proxy.readQuery({
        query: GET_POSTS,
      });
      //make copy as cache is read only
      let newData = { ...data };
      //filter out the post from the array of old posts
      newData.getPosts = newData.getPosts.filter((post) => post.id !== postId);
      console.log("newData", newData);
      //write query
      proxy.writeQuery({
        query: GET_POSTS,
        data: {
          getPosts: [...newData.getPosts],
        },
      });

      //case when home delete happens so check callback is passed or not
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
        onConfirm={deletePost}
      />
    </>
  );
}

const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export default DeleteComponent;
