
const mongoose = require('mongoose');

const banner = mongoose.Schema({
  imageUrl: {
    type: [String],
  },
  heading: {
    type: String,
  },
  subheading: {
    type: String,
  },
  link: {
    type: String,
  },
}, { timestamp: true });
module.exports = mongoose.model('banner', banner);
