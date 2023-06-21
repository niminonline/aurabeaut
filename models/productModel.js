const mongoose = require('mongoose');

const produtSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    category: {
      type: String,
      require: true,
    },
    imageUrl: {
      type: Array,
      required: true,
    },
    is_blocked: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Number,
      require: true,
    },
    brand: {
      type: String,
      require: true,
    },
  },

  { timestamps: true },
);

module.exports = mongoose.model('Product', produtSchema);