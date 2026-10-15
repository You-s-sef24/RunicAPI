const jwt = require("jsonwebtoken");
const Token = require("../models/token");

const verifyToken = async (req, res, next) => {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    const existingToken = await Token.findOne({ token });
    if (!existingToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.userId = decoded.id;
    req.token = token;
    req.isAdmin = decoded.isAdmin;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
