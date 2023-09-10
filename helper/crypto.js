const crypto = require('crypto');

const generateHmacSha256= async(data, secret) =>{
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(data);
  return hmac.digest('hex');
}


module.exports={generateHmacSha256}