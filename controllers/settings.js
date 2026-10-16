const Setting = require("../models/settings");
const { validationResult } = require("express-validator");

const getNailCost = async (req, res, next) => {
  try {
    const setting = await Setting.findOne();

    if (!setting) {
      return res.status(404).json({
        message: "Nail cost has not been configured",
      });
    }

    return res.status(200).json({
      message: "Nail cost retrieved successfully",
      nailCost: setting.nailCost,
    });
  } catch (err) {
    next(err);
  }
};

const updateNailCost = async (req, res, next) => {
  try {
    const results = validationResult(req);

    if (!results.isEmpty()) {
      return res.status(400).json({
        errors: results.array(),
      });
    }

    const { nailCost } = req.body;

    let setting = await Setting.findOne();

    if (!setting) {
      setting = await Setting.create({ nailCost });
    } else {
      setting.nailCost = nailCost;
      await setting.save();
    }

    return res.status(200).json({
      message: "Nail cost updated successfully",
      nailCost: setting.nailCost,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getNailCost,
  updateNailCost,
};
