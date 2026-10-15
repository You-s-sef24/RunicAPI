const { Schema, model } = require("mongoose");

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  device: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "90d",
  },
});

const Token = model("Token", tokenSchema);

module.exports = Token;
