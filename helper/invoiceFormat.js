// const invoiceHtml= '<html>        <body> <h2>Javascriptv1</h2> </body></html>'



const createInvoiceHtml=(invoiceData)=>{
    console.log(invoiceData);

        const { invoiceNumber, date, recipient, items,mobile,address, total } = invoiceData;
      
        const itemListHTML = items
          .map(
            (item) => `<tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.price}</td>
            <td>${item.quantity * item.price}</td>
          </tr>`
          )
          .join('');
      
        return `
        <html>
        <head>
          <style>
            body {
                width: 90%;
                margin:auto;
              font-family: Arial, sans-serif;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            table th,
            table td {
              border: 1px solid black;
              padding: 8px;
            }
            table th {
              background-color: lightgray;
            }
            .invoice-header {
              margin-bottom: 20px;
            }
            .invoice-header h1 {
              font-size: 24px;
            }
            .invoice-footer {
              margin-top: 20px;
              text-align: right;
            }
        p{
             font-size: .8rem;
             line-height: .8rem;
         }
          </style>
        </head>
        <body>
        <img src="../public/images/aurabeaut-text.png">
          <div class="invoice-header">
            <h1>auraBeaut</h1>
            <p>Invoice Number: ${invoiceNumber}</p>
            <p>Name: ${recipient}</p>
            <p>Mobile: ${mobile}</p>
            <p>Address: ${address}</p>
            <p>Date: ${date}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemListHTML}
            </tbody>
          </table>
          <div class="invoice-footer">
            <p>Total: ${total}</p>
          </div>
        </body>
      </html>
        `;
      }
      




module.exports={createInvoiceHtml}