const Post = require("../../modals/Post");
const checkAuth = require("../../utils/check-auth");
const { AuthenticationError } = require("apollo-server");
const { UserInputError } = require("apollo-server");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

module.exports = {
  //showing Subscription
  //context => {req, pubsub}

  Subscription: {
    newPost: {
      //subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("NEW_POST"), #didnt worked
      subscribe: () => pubsub.asyncIterator("NEW_POST"),
    },
  },

  //query 1
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        console.log(err);
      }
    },

    //query to retrv post by ID
    async getPost(_, { postId }) {
      const post = await Post.findById(postId);
      try {
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },

  //Mutation
  Mutation: {
    async createPost(_, { body }, context) {
      const user = checkAuth(context);
      //console.log("user after auth middleware", user);

      //middleware came into action to verify request send to apollo
      //checkauth returns me token or error
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      //save post
      const post = await newPost.save();

      //publish event for pubsub subcription
      //context.pubsub.publish("NEW_POST", {
      pubsub.publish("NEW_POST", {
        newPost: post,
      });

      return post;
    },

    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      try {
        //get the post by id so that check with user> means user can delete own post and he has to login
        const post = await Post.findById(postId);

        if (user.username === post.username) {
          await post.delete();
          return "Post deleted Successfully!";
        } else {
          throw new AuthenticationError("Action not allowed!");
        }
      } catch (error) {
        throw new Error(error);
      }
    },

    //like post
    async likePost(_, { postId }, context) {
      const user = checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        //user will have one like per post
        if (post.likes.find((like) => like.username === user.username)) {
          //return obj if true  else undefined
          //if already liked -> unlike it

          post.likes = post.likes.filter(
            (like) => like.username !== user.username
          );
        } else {
          //like the post if that logged in user is not there in araay of likes

          let like = {
            username: user.username,
            createdAt: new Date().toISOString(),
          };
          post.likes.push(like);
        }
        //after evrything done either dislike or like
        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not Found");
      }
    },
  },
};
