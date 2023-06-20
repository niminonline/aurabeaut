
const nodemailer = require('nodemailer');

async function verifyEmail(email, otp) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'niminonline@gmail.com',
          pass: 'xqtgfrkxkvotbulz'
        }
      });
      const mailOptions = {
        from: 'niminonline@gmail.com',
        to: email,
        subject: 'Your OTP for user verification',
        text: `Your OTP is ${otp}. Please enter this code to verify your account.`
      };
      const result = await transporter.sendMail(mailOptions);
      console.log(result);
    } catch (error) {
      console.log(error.message);
    }
  }
  
  const generateOtp=()=>{
    try{
        
            const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
            return otp;
    
    }
    catch(err){
        console.log(err.message);
    }
  }
  module.exports={generateOtp,verifyEmail}