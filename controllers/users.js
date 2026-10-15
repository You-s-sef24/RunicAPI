const User = require("../models/user");
const Token = require("../models/token");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

const getAllUsers = async (req, res, next) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.find({}, { password: 0, __v: 0 });
    if (users.length === 0) {
      return res.status(200).json({ message: "No users found", users });
    }
    return res
      .status(200)
      .json({ message: "Users retrieved Successfully", users });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }
    const user = await User.findOne({ _id: userId }, { password: 0, __v: 0 });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User retrived successfully", user });
  } catch (error) {
    next(error);
  }
};

const editProfile = async (req, res, next) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({
        errors: result.array(),
      });
    }

    const { name } = req.body;
    const updates = {};
    if (name) updates.name = name;

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.userId },
      updates,
      { returnDocument: "after" },
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const responseUser = updatedUser.toObject();
    delete responseUser.password;

    return res
      .status(200)
      .json({ message: "Profile updated successfully", user: responseUser });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { name, email, password ,phone} = req.body;

    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({
        errors: result.array(),
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    const responseUser = newUser.toObject();
    delete responseUser.password;

    return res
      .status(201)
      .json({ message: "User created succesfully", user: responseUser });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({
        errors: result.array(),
      });
    }

    const user = await User.findOne({ email }, { __v: 0 });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const matchedPassword = await bcrypt.compare(password, user.password);

    if (!matchedPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user.email, user._id, user.isAdmin);
    const newToken = new Token({
      token,
      device: req.headers["user-agent"],
      userId: user._id,
    });
    await newToken.save();

    let responseUser = user.toObject();
    delete responseUser.password;
    responseUser = { ...responseUser, token };
    return res
      .status(200)
      .json({ message: "Logged in successfully", user: responseUser });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await Token.deleteOne({ token: req.token });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getProfile,
  editProfile,
  register,
  login,
  logout,
};
