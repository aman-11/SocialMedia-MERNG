const { gql } = require('apollo-server');  //dependency installed in apollo_server

module.exports = gql`
    
    type Post{    #post jb return krega toh kon si field sth krega so post object type
        id: ID!
        body: String!
        createdAt: String!
        username: String!
    }

    type User{ #user
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

    type Query{    #query type ke endpoint bata do and specify return type
        getPosts: [Post]
    }

    type Mutation{ #mutation type
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
    }

`