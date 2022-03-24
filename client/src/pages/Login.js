import React, { useState, useContext } from "react";
import { Button, Form } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

//import custom hook
import { useForm } from "../utils/hooks";

//use context
import { AuthContext } from "../context/auth";

function Login(props) {
  const navigate = useNavigate();
  const context = useContext(AuthContext); //context
  const [errors, setErros] = useState({});

  //using custom Hook
  const { handleValues, onSubmit, values } = useForm(loginUserCallback, {
    username: "",
    password: "",
  });

  const [loginUser, { data, loading }] = useMutation(LOGIN_USER, {
    variables: {
      username: values.username,
      password: values.password,
    },
    update(_, result) {
      //console.log("login result", result.data.login);

      //after successfully login pass the data to context store using dispatch event
      context.login(result.data.login);

      //nav back to home
      navigate("/");
    },
    onError(err) {
      setErros(err.graphQLErrors[0].extensions.errorList);
    },
  });

  function loginUserCallback() {
    loginUser();
  }

  var showLoading = loading && (!data || Object.keys(errors).length === 0);

  return (
    <div className="form-container">
      <Form
        onSubmit={onSubmit}
        noValidate
        style={{ marginTop: 10 }}
        className={showLoading ? "loading" : ""}
      >
        <h1>Login</h1>

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
          label="Password"
          placeholder="Password..."
          name="password"
          value={values.password}
          type="password"
          onChange={handleValues}
          error={errors.password ? true : false}
        />

        <Button type="submit" primary>
          Login
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

const LOGIN_USER = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      token
      email
      createdAt
    }
  }
`;

export default Login;
