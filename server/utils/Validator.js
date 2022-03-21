module.exports.validateRegisterInput = (
  username,
  password,
  confirmPassword,
  email
) => {
  const errors = {};

  //username
  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }

  //email
  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    const regex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email.match(regex)) {
      errors.email = "Email is not in proper format";
    }
  }

  //password
  if (password === "") {
    errors.password = "Password not be empty";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Password dosent match";
  }

  return {
    errorList: errors,
    valid: Object.keys(errors).length < 1, //means no errro so valid
  };
};

module.exports.validateLogin = (username, password) => {
  const errors = {};

  //username
  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }

  //password
  if (password === "") {
    errors.password = "Password not be empty";
  }

  return {
    errorList: errors,
    valid: Object.keys(errors).length < 1, //means no errro so valid
  };
};
