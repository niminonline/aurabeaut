const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
      required: false,
    },

    isBlocked: {
      type: Boolean,
      required: false,
    },
    address:[{
      name: {
        type: String,
        required: false,
      },
    
      mobile: {
        type: String,
        required: false,
      },
    
      address: {
        type: String,
        required: false,
      },
    
      city: {
        type: String,
        required: false,
      },
    
      state: {
        type: String,
        required: false,
      },
    
      pin: {
        type: String,
        required: false,
      },
      is_default: {
        type: Boolean,
        required: false,
      },
  }],
  wishlist:[{
    product:{
      type:mongoose.Types.ObjectId,
      ref:'Product',
      
    }
  }],
  
 wallet:{
  type:Number,
  default:0
 },


});

module.exports = mongoose.model('User', userSchema);

