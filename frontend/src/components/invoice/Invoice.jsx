import { motion } from "framer-motion";
import { useRef } from "react";
import { FaCheck } from "react-icons/fa6";

const Invoice = ({ orderInfo, setShowInvoice }) => {
  const invoiceRef = useRef(null);
  const handlePrint = () => {
    const printContent = invoiceRef.current.innerHTML;
    const WinPrint = window.open("", "", "width=380,height=900");

    const logoUrl = `${window.location.origin}/point-of-service.png`;
    const orderNumber = `#${Math.floor(new Date(orderInfo.orderDate).getTime())}`;
    const billNo = orderInfo.billNo || orderNumber;
    const cashier = orderInfo.cashierName || '---';
    const tableNo = orderInfo.table?.tableNo ?? orderInfo.tableNo ?? (orderInfo.customerDetails?.table ?? 'N/A');

    // build items rows and totals
    const items = orderInfo.items || [];
    let itemsRows = '';
    let totalQty = 0;
    items.forEach((it, idx) => {
      const qty = Number(it.quantity || 0);
      const price = Number(it.price || 0);
      const amount = qty * price;
      totalQty += qty;
      itemsRows += `
        <tr>
          <td style="width:28px;vertical-align:top;">${idx + 1}</td>
          <td style="vertical-align:top;">${it.name.replace(/</g, '&lt;')}</td>
          <td style="text-align:center;width:50px;vertical-align:top;">${qty}</td>
          <td style="text-align:right;width:70px;vertical-align:top;">₹${price.toFixed(2)}</td>
          <td style="text-align:right;width:80px;vertical-align:top;">₹${amount.toFixed(2)}</td>
        </tr>`;
    });

    const subTotal = Number(orderInfo.bills?.total || 0);
    const tax = Number(orderInfo.bills?.tax || 0);
    const grand = Number(orderInfo.bills?.totalWithTax || subTotal + tax);
    const roundOff = (Math.round(grand) - grand).toFixed(2);

    WinPrint.document.write(`
      <html>
        <head>
          <title>Order Receipt</title>
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <style>
            body { font-family: 'Courier New', monospace; color:#111; padding:6px; }
            .center { text-align:center }
            .biz { font-weight:900; font-size:18px }
            .sub { font-size:11px }
            .hr { border-top:1px solid #000; margin:6px 0 }
            .underline { border-bottom:1px solid #000; height:14px; display:block }
            table { width:100%; border-collapse:collapse; font-size:12px }
            td, th { padding:2px 4px }
            .right { text-align:right }
            .bold { font-weight:800 }
          </style>
        </head>
        <body>
          <div class="center">
            <img src="${logoUrl}" style="width:90px;height:auto;object-fit:contain;" onerror="this.style.display='none'" />
            <div class="biz">Point of Service</div>
            <div class="sub">(A UNIT OF VIBHA FOODS)</div>
            <div class="sub">2nd Floor, OEU Building, KIIT College Road, Patia.</div>
            <div class="sub">Ph: 9646767888</div>
          </div>

          <div class="hr"></div>

          <div><strong>Name:</strong> ${orderInfo.customerDetails?.name || orderInfo.customerName || ''}</div>
          <div><strong>Mobile:</strong> ${orderInfo.customerDetails?.phone || orderInfo.customerPhone || ''}</div>
          <div class="underline"></div>

          <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:12px">
            <div><strong>Date:</strong> ${new Date(orderInfo.orderDate).toLocaleDateString()}</div>
            <div><strong>Table:</strong> ${tableNo}</div>
          </div>
          <div style="margin-top:4px;font-size:12px"><strong>Time:</strong> ${new Date(orderInfo.orderDate).toLocaleTimeString()}</div>
          <div style="margin-top:4px;font-size:12px"><strong>Cashier:</strong> ${cashier} &nbsp;&nbsp; <strong>Bill No.:</strong> ${billNo}</div>

          <div class="hr"></div>

          <table>
            <thead>
              <tr>
                <th style="width:28px;text-align:left">No.</th>
                <th style="text-align:left">Item</th>
                <th style="text-align:center;width:50px">Qty.</th>
                <th style="text-align:right;width:70px">Price</th>
                <th style="text-align:right;width:80px">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <div class="hr"></div>

          <div style="display:flex;justify-content:space-between;font-size:12px">
            <div><strong>Total Qty:</strong> ${totalQty}</div>
            <div><strong>Sub Total</strong> ₹${subTotal.toFixed(2)}</div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:12px">
            <div></div>
            <div>CGST ₹${(tax / 2).toFixed(2)}</div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:12px">
            <div></div>
            <div>SGST ₹${(tax / 2).toFixed(2)}</div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:14px;margin-top:6px">
            <div class="bold">Round off</div>
            <div class="bold">${Number(roundOff) >= 0 ? '+' : ''}${Number(roundOff).toFixed(2)}</div>
          </div>

          <div class="hr"></div>

          <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:900">
            <div>Grand Total</div>
            <div>₹${grand.toFixed(2)}</div>
          </div>

          <div class="hr"></div>
          <div style="text-align:center;font-size:12px">!!! Thank You, Visit Again !!!</div>
        </body>
      </html>
    `);

    WinPrint.document.close();
    WinPrint.focus();
    setTimeout(() => {
      WinPrint.print();
      WinPrint.close();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[380px] max-w-full">
        <div ref={invoiceRef} className="p-2">
          <div className="flex justify-center mb-5">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
              className="w-14 h-14 border-8 border-green-500 rounded-full flex items-center justify-center shadow-lg bg-green-500"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="text-3xl"
              >
                <FaCheck className="text-white" />
              </motion.span>
            </motion.div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-1">Order Receipt</h2>
          <p className="text-gray-600 text-center mb-4">
            Thank you for your order!
          </p>

          <div className="border-t border-gray-300 pt-3 text-gray-700 text-sm space-y-2">
            <p>
              <strong>Order ID:</strong>{" "}
              <span className="order-id">
                #{Math.floor(new Date(orderInfo.orderDate).getTime())}
              </span>
            </p>
            <p>
              <strong>Name:</strong> {orderInfo.customerDetails.name}
            </p>
            <p>
              <strong>Phone:</strong> {orderInfo.customerDetails.phone}
            </p>
            <p>
              <strong>Guests:</strong> {orderInfo.customerDetails.guests}
            </p>
          </div>

          <div className="border-t border-gray-300 pt-3 mt-4">
            <h3 className="text-sm font-semibold mb-2">Items Ordered</h3>
            <table className="w-full text-gray-700 text-sm">
              <thead>
                <tr>
                  <th className="text-left">Item</th>
                  <th className="text-center">Qty</th>
                  <th className="text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {orderInfo.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td>{item.name}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">₹{item.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-300 pt-3 mt-4 text-gray-800 text-sm space-y-1">
            <p className="flex justify-between highlight-total">
              <span>Subtotal:</span>
              <span>₹{orderInfo.bills.total.toFixed(2)}</span>
            </p>
            <p className="flex justify-between">
              <span>Tax:</span>
              <span>₹{orderInfo.bills.tax.toFixed(2)}</span>
            </p>
            <p className="flex justify-between highlight-total border-t border-gray-400 pt-2">
              <span>Grand Total:</span>
              <span>₹{orderInfo.bills.totalWithTax.toFixed(2)}</span>
            </p>
          </div>

          <div className="mt-4 mb-1 text-xs text-gray-600 space-y-1">
            {orderInfo.paymentMethod === "Cash" ? (
              <p>
                <strong>Payment Method:</strong> {orderInfo.paymentMethod}
              </p>
            ) : (
              <>
                <p>
                  <strong>Payment Method:</strong> {orderInfo.paymentMethod}
                </p>
                <p>
                  <strong>Razorpay Order ID:</strong>{" "}
                  {orderInfo.paymentData?.razorpay_order_id}
                </p>
                <p>
                  <strong>Razorpay Payment ID:</strong>{" "}
                  {orderInfo.paymentData?.razorpay_payment_id}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrint}
            className="text-blue-600 hover:underline text-sm px-4 py-2 rounded-md"
          >
            Print Receipt
          </button>
          <button
            onClick={() => setShowInvoice(false)}
            className="text-red-600 hover:underline text-sm px-4 py-2 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
