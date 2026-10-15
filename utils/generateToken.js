const jwt = require("jsonwebtoken");

const generateToken = (email, id, isAdmin) => {
  const token = jwt.sign({ email, id, isAdmin }, process.env.SECRET_KEY, {
    expiresIn: "90d",
  });

  return token;
};

module.exports = generateToken;
