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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    imageUrl: {
      type: [String],
      require: true,
    },
    is_blocked: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Number,
      require: true,
    },
    outofstock: {
      type: Boolean,
      default: false,
    },
    
    review: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        message: {
          type: String,
        },
        date: {
          type: String,
        },
        name: {
          type: String,
        },
        time: {
          type: String,
        },

      },
    ],
  },

  { timestamps: true },
);

module.exports = mongoose.model('Product', produtSchema);