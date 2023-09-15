const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
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
      ref: "Category",
      required: true,
    },
    imageUrl: {
      type: Array,
      required: true,
    },
    mainImage: {
      type: String,
    },
    stock: {
      type: Number,
      require: true,
    },
    brand: {
      type: String,
      require: true,
    },
    isProductUnlist: {
      type: Boolean,
      default: false,
    },
    isCategoryUnlist: {
      type: Boolean,
      default: false,
    },
    review: [
      {
        userId: {
          type: String,
        },
        reviewer: {
          type: String,
        },
        title: {
          type: String,
        },
        content: {
          type: String,
        },
        starRating: {
          type: Number,
        },
        date: {
          type: Date,
        },
      },
    ],
  },

  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
