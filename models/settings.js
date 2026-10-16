const { Schema, model } = require("mongoose");

const settingSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    values: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true },
);

const Setting = model("Setting", settingSchema);

module.exports = Setting;
