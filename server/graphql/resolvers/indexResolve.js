const postResolvers = require("./postResolv");
const userResolver = require("./userResolve");
const comments = require("./comments");

// Notes:
// 1. Querries are run parallel
// 2. Mutations are run serially
// 3. parameters: (parent, args, context, info) => {}

module.exports = {
  //modifiers
  //specify the name of type
  Post: {
    // set any type of query or mutation this will come here since whose every return type is Post ->
    //and do all sort of calulation and apply
    likesCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },

  Query: {
    ...postResolvers.Query,
  },

  Mutation: {
    ...userResolver.Mutation,
    ...postResolvers.Mutation,
    ...comments.Mutation,
  },

  Subscription: {
    ...postResolvers.Subscription,
  },
};
