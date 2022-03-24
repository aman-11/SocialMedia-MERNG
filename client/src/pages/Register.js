import React, { useState, useContext } from "react";
import { Button, Form } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

//import custom hook
import { useForm } from "../utils/hooks";

//use context
import { AuthContext } from "../context/auth";

function Register(props) {
  const navigate = useNavigate();
  const context = useContext(AuthContext); //context

  //setting up the  errro returned by graphql
  const [errors, setErros] = useState({});

  //using custom Hook
  const initialState = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const { handleValues, onSubmit, values } = useForm(
    registerUser,
    initialState
  );

  const [addUser, { data, loading }] = useMutation(REGISTER_USER, {
    variables: {
      username: values.username, //or you can user "variables: values" as it hold same thing
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
    },
    update(_, result) {
      //params(proxy, result)
      console.log("result", result); //result is the data which we get back from server

      //after successfully login pass the data to context store using dispatch event
      context.login(result.data.register);

      navigate("/");
    },
    onError(err) {
      //console.log("err", err.graphQLErrors[0].extensions.errorList);
      setErros(err.graphQLErrors[0].extensions.errorList);
    },
  });

  function registerUser() {
    addUser();
  }

  //issue is there sometimes apollo keeps lpading true even though data is recvd
  var showLoading = loading && (!data || Object.keys(errors).length === 0); //loading = true and data is not there

  return (
    <div className="form-container">
      <Form
        onSubmit={onSubmit}
        noValidate
        style={{ marginTop: 10 }}
        className={showLoading ? "loading" : ""}
      >
        <h1>Register</h1>
        <Form.Input
          label="Username"
          type="text"
          name="username"
          placeholder="Username..."
          value={values.username}
          onChange={handleValues}
          error={errors.username ? true : false}
        />
        <Form.Input
          label="Email"
          placeholder="Email..."
          name="email"
          type="email"
          value={values.email}
          onChange={handleValues}
          error={errors.email ? true : false}
        />
        <Form.Input
          label="Password"
          placeholder="Password..."
          name="password"
          value={values.password}
          type="password"
          onChange={handleValues}
          error={errors.password ? true : false}
        />
        <Form.Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password..."
          value={values.confirmPassword}
          onChange={handleValues}
        />
        <Button type="submit" primary>
          Register
        </Button>
      </Form>

      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const REGISTER_USER = gql`
  mutation Register( #define mutation name  and the tpe of each Variable and later pass down to register(mutation)
    $username: String!
    $password: String!
    $email: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        password: $password
        email: $email
        confirmPassword: $confirmPassword
      }
    ) {
      id
      username
      token
      email
      createdAt
    }
  }
`;

export default Register;
