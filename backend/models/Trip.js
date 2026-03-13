const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
{
  cabId: {
    type: String,
    required: true
  },

  verified: {
    type: Boolean,
    default: false
  },

  startTime: {
    type: Date,
    default: Date.now
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);