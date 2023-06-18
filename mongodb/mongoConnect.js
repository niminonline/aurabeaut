const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const connectDB = () => {
  try {
    mongoose.set('strictQuery', true);
    mongoose.connect(process.env.mongo_url);
  } catch (error) {
    console.log('connected');
  }
};

module.exports = {
  connectDB
};
