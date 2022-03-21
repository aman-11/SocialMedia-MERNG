const bcrypt = require("bcryptjs");
const { UserInputError } = require("apollo-server");
const jwt = require("jsonwebtoken");

const User = require("../../modals/User");
const { SECRET_KEY } = require("../../config");
const {
  validateRegisterInput,
  validateLogin,
} = require("../../utils/Validator");

function generateToken(user) {
  return jwt.sign(
    {
      //payload
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY, //key
    { expiresIn: "1h" } //options
  );
}

//parent-> i/p of last step -> _ // args is arguments destrucutre it //connetxt //info-> metadata
module.exports = {
  Mutation: {
    async login(_, { username, password }, context, info) {
      const { errorList, valid } = validateLogin(username, password);
      if (!valid) {
        throw new UserInputError("Validator", { errorList });
      }

      const user = await User.findOne({ username });

      if (!user) {
        errorList.general = "User not found";
        throw new UserInputError("User not found", { errorList });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errorList.general = "Wrong Credentials";
        throw new UserInputError("Wrong Credentials", { errorList });
      }

      const token = generateToken(user);
      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    async register(
      _,
      { registerInput: { username, password, confirmPassword, email } },
      context,
      info
    ) {
      //TODO 1. validate the data
      // console.log(typeof(password))
      // console.log(typeof(confirmPassword))
      const { errorList, valid } = validateRegisterInput(
        username,
        password,
        confirmPassword,
        email
      );

      console.log("in the userr", errorList);
      if (!valid) {
        throw new UserInputError("Validator", { errorList });
      }
      //TODO 2. make sure user dosent exists
      //TODO 3. hash pass auth tokens done
      //console.log(username, password, confirmPassword, email)

      //find if user exists
      const existedUser = await User.findOne({ username });
      if (existedUser) {
        throw new UserInputError("Username is already taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        password: hashedPassword,
        username,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();
      const token = generateToken(res);
      console.log(res);
      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
