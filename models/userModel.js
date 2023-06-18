const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
    },
    email: {
      type: String,
      required: true,
    },

    mobile: {
      type: Number,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    isVerified: {
      type: Boolean,
      required: true,
    },

    isBlocked: {
      type: Boolean,
      required: true,
    },
    address:[{
      name: {
        type: String,
        required: true,
      },
    
      mobile: {
        type: String,
        required: true,
      },
    
      addressLine1: {
        type: String,
        required: true,
      },
    
      addressLine2: {
        type: String,
      },
    
      city: {
        type: String,
        required: true,
      },
    
      state: {
        type: String,
        required: true,
      },
    
      pin: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      is_default: {
        type: Boolean,
        required: true,
      },
  }]
})

module.exports = mongoose.model('User', userSchema);

