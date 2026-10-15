const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 25,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    isAdmin:{
      type: Boolean,
      default: false
    },
    phone:{
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 15,
    }
  },
  { timestamps: true },
);

const User = model("User", userSchema);

module.exports = User;
