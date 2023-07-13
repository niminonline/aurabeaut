
const Order= require("../../models/orderModel");




//===================================Get payment modes ==========================

const getPaymentModes = async(req,res)=>{
    try{
        const orderData= await Order.find({});
        // console.log(orderData);
        let codCount=0,razorpayCount=0,walletCount=0;
        let paymentValues=[];
        orderData.map(item=>{
            if(item.paymentMethod=="Razorpay")
            razorpayCount++;
            else  if(item.paymentMethod=="Wallet")
            walletCount++;
            else  if(item.paymentMethod=="Cash on Delivery")
            codCount++
        })
        // console.log({'Cash on delivery':codCount, "Razorpay": razorpayCount,"Wallet": walletCount})
        res.json({'Cash on delivery':codCount, "Razorpay": razorpayCount,"Wallet": walletCount});

    }
    catch(err){
        console.log(err.message);
res.status(404).render("404",{errorMessage:err.message});
    }
}



module.exports={getPaymentModes}
