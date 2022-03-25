import React from "react";
import { Button, Form } from "semantic-ui-react";

//graphql and query
import { gql, useMutation } from "@apollo/client";
import { GET_POSTS } from "../utils/graphqlQuery";

//import custom hook
import { useForm } from "../utils/hooks";

function PostForm() {
  //custom hooks
  const { handleValues, onSubmit, values } = useForm(createPostCallback, {
    body: "",
  });

  const [createPost, { error }] = useMutation(CREATE_POST, {
    variables: {
      body: values.body,
    },
    update(proxy, result) {
      //updating the cache as proxy gives all access to read data in apollo client cache
      // ...after the create is done is and it is an old data
      const updatedData = proxy.readQuery({
        query: GET_POSTS,
      });
      //now append updated data and old data
      //now to persist it or hold the data wen need to 'write' the query
      proxy.writeQuery({
        query: GET_POSTS,
        data: {
          getPosts: [result.data.createPost, ...updatedData.getPosts],
        },
      });

      console.log("created post result", result.data.createPost);
      values.body = "";
    },
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.Input
            placeholder="Say hi..."
            name="body"
            onChange={handleValues}
            value={values.body}
            error={error ? true : false}
          />
          <Button type="submit" color="teal">
            Create
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{marginBottom:20}}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST = gql`
  mutation CreatePost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      comments {
        id
        createdAt
        username
        body
      }
      likes {
        id
        createdAt
        username
      }
      likesCount
      commentCount
    }
  }
`;

export default PostForm;
