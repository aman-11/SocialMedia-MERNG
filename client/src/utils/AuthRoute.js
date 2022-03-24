//checks if user token is there not allow to go to  login page and register page
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../context/auth";

function AuthRoute({ Component }) {
  const { user } = useContext(AuthContext);

  return !user ? <Component/> : <Navigate to="/" />;
}

export default AuthRoute;
