const postResolvers = require('./postResolv');
const userResolver = require('./userResolve');

module.exports = {

    Query: {
        ...postResolvers.Query
    },

    Mutation: {
        ...userResolver.Mutation
    }

}
