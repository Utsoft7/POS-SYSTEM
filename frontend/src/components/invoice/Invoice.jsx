import { motion } from "framer-motion";
import { useRef } from "react";
import { FaCheck } from "react-icons/fa6";

const Invoice = ({ orderInfo, setShowInvoice }) => {
  const invoiceRef = useRef(null);
  const handlePrint = () => {
    const printContent = invoiceRef.current.innerHTML;
    const WinPrint = window.open("", "", "width=900,height=650");

    WinPrint.document.write(`
      <html>
        <head>
          <title>Order Receipt</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #333;
            }
            .receipt-container {
              width: 320px;
              margin: 0 auto;
              border: 1px solid #ddd;
              padding: 15px;
              box-sizing: border-box;
            }
            h2 {
              text-align: center;
              margin-bottom: 8px;
            }
            p, li {
              font-size: 14px;
              line-height: 1.4;
              margin: 4px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th, td {
              text-align: left;
              padding: 6px 4px;
              border-bottom: 1px solid #ddd;
            }
            .total-row td {
              font-weight: 700;
              font-size: 18px;
              border-top: 2px solid #444;
              color: #1a202c; /* Darker color for totals */
            }
            .highlight-total {
              font-weight: 700;
              font-size: 16px;
              color: #d97706; /* Amber-600 (orange highlight) */
            }
            .order-id {
              font-family: monospace;
              background-color: #f5f5f5;
              padding: 4px 6px;
              border-radius: 4px;
              display: inline-block;
              margin-top: 4px;
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            ${printContent}
          </div>
        </body>
      </html>
    `);

    WinPrint.document.close();
    WinPrint.focus();
    setTimeout(() => {
      WinPrint.print();
      WinPrint.close();
    }, 1000);
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
