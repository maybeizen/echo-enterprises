const { Schema, model } = require("mongoose");

const ticketSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  channelId: {
    type: String,
    required: true,
  },
});

module.exports = model("Ticket", ticketSchema);
