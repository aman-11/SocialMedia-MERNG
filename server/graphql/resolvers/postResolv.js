const Post = require("../../modals/Post");

module.exports = {
  //query 1
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find();
        return posts;
      } catch (err) {
        console.log(err);
      }
    },
  },

  //query 2
};
