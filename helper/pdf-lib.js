const { PDFDocument, StandardFonts } = require('pdf-lib');



const  generateInvoice= async(content)=> {
  try{
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 30

  page.drawText(content, {
    x: 50,
    y: page.getHeight() - 50,
    size: fontSize,
    font: font,
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
catch(err){

}}


module.exports={generateInvoice}
