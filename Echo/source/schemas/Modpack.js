const { Schema, model } = require("mongoose");

const modpackSchema = new Schema({
  modpackId: {
    type: String,
    unique: true,
  },
  lastUpdated: Number,
});

module.exports = model("Modpack", modpackSchema);
