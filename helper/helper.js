const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

async function verifyEmail(email, otp) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "noreply.aurabeaut@gmail.com",
        pass: "bdzaicivbiwkkoua",
      },
    });
    const mailOptions = {
      from: "noreply.aurabeaut@gmail.com",
      to: email,
      subject: "OTP for Signup Verification ",
      text: `Hello,
        Greetings from auraBeaute.
        Your one time password is ${otp}. Please enter this code to verify your account. This is a system generated e-mail and please do not reply.
        Regards,
        Team auraBeaut`,
    };
    const result = await transporter.sendMail(mailOptions);
    console.log(result);
  } catch (error) {
    console.log(error.message);
  }
}

const generateOtp = () => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    return otp;
  } catch (err) {
    console.log(err.message);
  }
};

// =============================Encrypt Password=============================

const hashPassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return await bcrypt.hash(password, 10);
  } catch (error) {
    console.log(error.message);
  }
};



module.exports = { generateOtp, verifyEmail, hashPassword };
