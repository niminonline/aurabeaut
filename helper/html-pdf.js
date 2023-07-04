const pdf = require('html-pdf');

// function generateInvoiceHTML(invoiceData) {
// }

const generateInvoicePDF= async (invoiceHTML, outputFilePath)=> {


try{

  //const invoiceHTML = generateInvoiceHTML(invoiceData);

  return new Promise((resolve, reject) => {
    pdf.create(invoiceHTML).toFile(outputFilePath, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

catch(err){
    console.log(err.message)
}
}
module.exports = { generateInvoicePDF };