const { gql } = require("apollo-server"); //dependency installed in apollo_server

module.exports = gql`
  type Post { #post jb return krega toh kon si field sth krega so post object type
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    likesCount: Int!
    commentCount: Int!
  }

  type Comment { #comment
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }

  type Like { #comment
    id: ID!
    createdAt: String!
    username: String!
  }

  type User { #user
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  type Query { #query type ke endpoint bata do and specify return type
    getPosts: [Post]
    getPost(postId: ID!): Post
  }

  type Mutation { #mutation type
    register(registerInput: RegisterInput): User! #object-> registerInput -> registerInput: { username, password, confirmPassword, email }
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }

  #extra learning
  type Subscription {
    newPost: Post!
  }
`;
