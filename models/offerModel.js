
const mongoose = require('mongoose');

const offer = mongoose.Schema(
  {
    offerfor: {
      type: String,
      required: true,
    },
    offerid: {
      type: String,
      required: true,
    },
    startdate: {
      type: String,
      required: true,
    },
    enddate: {
      type: String,
      required: true,
    },
    percent: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: 'Inactive',
    },
  },
  { timestamp: true },
);
module.exports = mongoose.model('offer', offer);
