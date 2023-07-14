

const createInvoiceHtml=(orderData)=>{

const datas= orderData.map((item)=>
 ` <tr>
<td>
  ${item.invoiceNumber}
</td>
<td>
  ${item.date.toLocaleString('en-IN',{dateStyle:"long"})}
</td>
<td>
  ${item.address.name}
</td>
<td>
  ${item.product[0].name+ " + "+item.product.length+" items"}
</td>
<td>
  ${item.paymentMethod}
</td>
<td>
  ${item.totalAmount}
</td>
<td>
  ${item.status}
</td>


  </tr>`

)

      
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
              font-size: 14px;
              text-align:center
            }
            .invoice-footer {
              margin-top: 20px;
              text-align: right;
            }
        p{
             font-size: .6rem;
             line-height: .6rem;
         }
         td{
          font-size: .5rem;
          line-height: .5rem;
      }
          </style>
          
        </head>


        <body>
       
          <div class="invoice-header">
            <h1>auraBeaut</h1>
            <h1>Sales Report</h1>
           
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Date</th>
                <th>User</th>
                <th>Product</th>
                <th>Payment Mode</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>

              ${datas}
         
              </tbody>
            
          </table>
        
        </body>
      </html>
        `;
      }
      




module.exports={createInvoiceHtml}