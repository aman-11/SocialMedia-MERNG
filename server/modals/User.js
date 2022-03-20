const { model, Schema } = require('mongoose');

const UserSchema = new Schema({

    username: String,
    password: {
        type: String
      },
    email: String,
    createdAt: String,

}); 

module.exports = model("Users", UserSchema);

