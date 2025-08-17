const mongoose = require('mongoose');

const kotSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    tableNumber: { type: Number },
    items: [
      {
        name: { type: String },
        quantity: { type: Number },
      },
    ],
    status: { type: String, default: 'New' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Kot', kotSchema);
