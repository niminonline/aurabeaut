
const mongoose = require('mongoose');

const banner = mongoose.Schema({
  imageUrl: {
    type: [String],
  },
  title: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  buttonText: {
    type: String,
  },
  buttonLink: {
    type: String,
  },
 
}, { timestamp: true });
module.exports = mongoose.model('banner', banner);
