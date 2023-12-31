const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({

    category: {
        type: String,
        required: true
    },

    imageUrl: {
        type: String,
        required: true
    },
    isUnList: {
      type: Boolean,
      default: false,
    },
})


module.exports = mongoose.model('Category', categorySchema)
