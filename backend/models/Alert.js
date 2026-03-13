const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
{
  userId: {
    type: String,
    required: true
  },
  msg: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  ts: {
    type: Date,
    default: Date.now
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);