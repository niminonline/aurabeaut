const Product = require("../../models/productModel");
const User = require("../../models/userModel");
const Order = require("../../models/orderModel");
const { ObjectId } = require("mongodb");
const {generateInvoice}= require("../../helper/pdf-lib")
const path = require("path");
const fs = require('fs');

//=================Load Checkout Page================================

const loadCheckout = async (req, res) => {
  try {
    const id= new ObjectId(req.session.user_id);
    const userData= await User.findOne({_id:req.session.user_id}).populate('cart.product').lean();
  // const userData = await User.aggregate([{
  //       $match: { _id: id}
  //     },
  //   {
  //     $lookup: {
  //       from: 'products',
  //       localField: 'cart.product',
  //       foreignField: '_id',
  //       as: 'product'
  //     }
  //   }
  // ])
    const productData = await Product.find(); 

    let sum=0;
    const subTotal= userData.cart.map((item)=>{
     
      sum+=(item.product.price* item.quantity);
      return sum
    }
    ) 

    if(userData.cart.length>0){
    res.render("checkout", { userData: userData ,subTotal:sum});
  }
  else{
    res.render("cart", { userData: userData ,subTotal:sum,errorMessage:"Your cart is empty"});
  }
  } catch (error) {
    console.log(error.message);
  }
};


//=================Place Order================================

const placeOrder = async (req, res) => {
  try {
    

    const {notes,paymentMode,addressIndex,totalAmount}=req.body;
    const userData= await User.findOne({_id:req.session.user_id}).populate('cart.product').lean();

    const cartProducts = userData.cart.map((item) => ({
      id: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.imageUrl[0],
      total: item.product.price * item.quantity,
    }));

    const selectedAddress=userData.address[addressIndex]
    const address= selectedAddress.address+", "+selectedAddress.city+", "+selectedAddress.state+", Pincode: "+selectedAddress.pincode+", "+selectedAddress.landmark;


       const order= new Order({
       userId: new ObjectId(req.session.user_id),
       name: userData.address[addressIndex].name,
       product: cartProducts,
       mobile: userData.address[addressIndex].mobile,
      address:address,
      totalAmount:  totalAmount ,
      paymentMethod:paymentMode,
      date: new Date().toISOString().split('T')[0],
      notes: notes
    });

console.log("Cart prducts",cartProducts);
    

cartProducts.map((item=>{
  
}))



//////////////////////



    const saveOrder= await order.save();

    if(saveOrder){






       const userData= await User.findOne({_id:req.session.user_id})
      userData.cart=[];
      await userData.save();

      console.log("Data added successfully");

      res.status(200).json({ message: "Order placed successfully!" });
    }
    else{
      console.log("Failed to add data")
    }


    
    // const userDataSave = user.save();
    // console.log("New order=========",order);
    // console.log("Address=========",order.address);
  } catch (error) {
    console.log(error.message);
  }
};


//=================Orders Load================================

const ordersLoad = async (req, res) => {
  try {



    const userData = await User.findOne({ _id: req.session.user_id });
    const orderData = await Order.find({userId:req.session.user_id});
    res.render("orders",{orderData:orderData,userData:userData})
    

  } catch (error) {
    console.log(error.message);
  }
};




//=================Order Details Load================================

const orderDetailsLoad = async (req, res) => {
  try {

    const {_id}= req.query;
    const userData = await User.findOne({ _id: req.session.user_id });
    const orderData = await Order.findById({_id});    
    res.render("orderDetails",{orderData:orderData,userData:userData})

    

  } catch (error) {
    console.log(error.message);
  }
};
//=================Download Invoice================================

const downloadInvoice = async (req, res) => {
  try {
    const contents="Contents qqqqq"
    const pdfBytes = await generateInvoice(contents);
    const filePath = path.join(__dirname, 'invoice001.pdf');
    fs.writeFileSync(filePath, pdfBytes);
    res.download(filePath, 'invoice001.pdf', (error) => {
      if (error) {
        console.error('Error downloading invoice:', error);
        res.status(500).send('Error downloading invoice');
      }
      fs.unlinkSync(filePath); 
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).send('Error generating invoice');
  }
};



module.exports = {loadCheckout,placeOrder,orderDetailsLoad,ordersLoad,downloadInvoice};
