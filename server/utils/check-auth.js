//middleware used  to check auth of user makking request to delete, create post  or anything so need to check jwt
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { AuthenticationError } = require("apollo-server");

module.exports = (context) => {
  //context = {...headers}
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    //bearer token
    const token = authHeader.split("Bearer ")[1];
    console.log("auth token", token);

    if (token) {
      try {
        const user = jwt.verify(token, SECRET_KEY);
        return user;
      } catch (err) {
        throw new AuthenticationError("Invalid/Expired token");
      }
    }
    throw new Error("Authorization token must be 'Bearer[token]'");
  }
  throw new Error("Authorization header must be provided");
};
