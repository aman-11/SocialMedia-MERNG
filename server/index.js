const {ApolloServer} = require('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const { MONGODB } = require('./config.js');
const resolvers = require('./graphql/resolvers/indexResolve');


const server = new ApolloServer({
    typeDefs,
    resolvers
})

mongoose
    .connect(MONGODB, { useNewUrlParser: true })
    .then(() => {
        console.log('db connected successfully');
        return server.listen({port: 5000});
    })
    .then( res => {
        console.log(`server running at ${res.url}`)
    });




/*******************************
 * 
 * @Resolver()
    export  class  HelloResolver{
    
    @Query( () => String)
    hello(){
        return "hello world from graphql and byeeee";
    }

}
 *************************************************/