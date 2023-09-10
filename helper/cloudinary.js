
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CloudName,
    api_key:process.env.CloudApi,
    api_secret: process.env.CloudSecret
    // cloud_name: "drmnkue88",
    // api_key: "824917676972826",
    // api_secret: "3fqyCdhdL3z9ctd4_mB5RxSWmRo",
  });
module.exports= cloudinary