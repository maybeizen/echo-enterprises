const { Schema, model } = require("mongoose");

const warnSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  warnsCount: {
    type: Number,
    default: 0,
  },
  warns: {
    type: Array,
    default: [],
  },
});

module.exports = model("Warns", warnSchema);
