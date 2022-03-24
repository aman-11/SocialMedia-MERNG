import React, { useReducer, createContext } from "react";
import jwtDecode from "jwt-decode";

const initialState = {
  user: null,
};

if (localStorage.getItem("jwtToken")) {
  //expiration is encoded inside the token
  //decode it
  const decodeToken = jwtDecode(localStorage.getItem("jwtToken"));

  if (decodeToken.exp * 1000 < Date.now()) {
    localStorage.removeItem("jwtToken");
  } else {
    //valid tolen

    //remember when jwt token is generated it takes three things -> 1. paylod(id, email, username) 2. SECRET_KEY 3. time
    //so when we decode we will be leftout with payload object
    //refer userResolver.js server file
    initialState.user = decodeToken;
  }
}

//the user data depends on the login and logout of user as it hold the toekn and other stuffs
const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {},
});

//create reducer -> bascially type of function which recvs action of type and payload and dosomething as Required
function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState); //useReducer takes 2 params Reduce_methood and initialState (obj)

  function login(userData) {
    //store user
    localStorage.setItem("jwtToken", userData.token);

    //dispatch action with some typeand add payload(object)
    dispatch({
      type: "LOGIN",
      payload: userData,
    });
  }
  //here the userData is returned from the reducer and its goes to AuthContext.Provider and update teh state

  function logout(userData) {
    localStorage.removeItem("jwtToken");

    dispatch({ type: "LOGIN" });
  }

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };

//TODO 1. store in local storge to persist the user
//TODO 2. store at a time of login action is dispatched
//TODO 3. remove at a time of logout action is dispatched

//Now here the other compoents in order to use context they will say => useContext(AuthContext);
//AuthProvider will wrap the app in order to makle  context Available
//persistance needs to be sorted out as on refresh we will losse state
