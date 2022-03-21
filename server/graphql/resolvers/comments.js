const Post = require("../../modals/Post");
const checkAuth = require("../../utils/check-auth");

const { UserInputError } = require("apollo-server");
const { AuthenticationError } = require("apollo-server");

module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      //check user auth by middleware
      const user = checkAuth(context);

      if (body.trim() === "") {
        throw new UserInputError("Empty Comment", {
          errors: {
            body: "Comment must be not empty",
          },
        });
      }

      const post = await Post.findById(postId); //when mongoose return data it turns into JSON object

      if (post) {
        //create a comment
        let comment = {
          body,
          username: user.username,
          createdAt: new Date().toISOString(),
        };

        //append the comment to post.comment array
        post.comments.unshift(comment); //unshift add the comment at the beginning of the array

        //save the post
        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not Found");
      }
    },

    //delete the comment
    deleteComment: async (_, { postId, commentId }, context) => {
      //check user auth by middleware
      const user = checkAuth(context);

      const post = await Post.findById(postId);

      if (post) {
        const commentIndex = post.comments.findIndex(
          (comment) => comment.id === commentId
        );

        //check if that comment belongs to user who is trying to delete or not
        if (post.comments[commentIndex].username === user.username) {
          post.comments.splice(commentIndex, 1);
          await post.save();

          return post;
        } else {
          throw new AuthenticationError("Action not allowed!");
        }
      } else {
        throw new UserInputError("Post not Found");
      }
    },
  },
};
