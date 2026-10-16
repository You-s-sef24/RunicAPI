const { Schema, model } = require("mongoose");

const settingSchema = new Schema(
  {
    nailCost: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

const Setting = model("Setting", settingSchema);

module.exports = Setting;
