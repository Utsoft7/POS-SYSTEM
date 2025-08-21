const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerDetails: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      guests: { type: Number, required: true },
    },
    orderStatus: {
      type: String,
      required: true,
    },
    orderDate: {
      type: Date,
      default: Date.now(),
    },
    bills: {
      total: { type: Number, required: true },
      tax: { type: Number, required: true },
      totalWithTax: { type: Number, required: true },
    },
    items: [],
    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
  billNo: { type: String, default: null },
    paymentMethod: String,
    paymentData: {
      razorpay_order_id: String,
      razorpay_payment_id: String,
    },

    // KOT fields
    kotNumber: { type: String, default: null },
    kotPrinted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
