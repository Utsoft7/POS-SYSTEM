const createHttpError = require("http-errors");
const Order = require("../models/orderModel");
const { default: mongoose } = require("mongoose");

const Counter = require("../models/counterModel");

const addOrder = async (req, res, next) => {
  try {
    const order = new Order(req.body);

    // generate a KOT number (short, unique-enough)
    order.kotNumber = `KOT-${Date.now().toString().slice(-6)}`;
    order.kotPrinted = false;

    // Atomically increment counter to create bill number
    const counter = await Counter.findOneAndUpdate(
      { _id: "billNo" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const seq = counter.seq;
    // Format bill number with leading zeros if desired
    order.billNo = `BILL-${String(seq).padStart(6, "0")}`;

    await order.save();

    // create KOT document for kitchen using populated order (ensure tableNo available)
    try {
      const Kot = require('../models/kotModel');
      const populatedOrderForKot = await Order.findById(order._id).populate('table');

      const tableNumber = populatedOrderForKot.table ? populatedOrderForKot.table.tableNo : (populatedOrderForKot.tableNo || null);

      const kotDoc = new Kot({
        orderId: order._id,
        tableNumber: tableNumber,
        items: (order.items || []).map(i => ({ name: i.name, quantity: i.quantity })),
        status: 'New'
      });
      await kotDoc.save();
    } catch (e) {
      console.error('Failed to create KOT doc', e);
    }

    // mark table as Booked and attach currentOrder so it won't show as Available
    try {
      const Table = require('../models/tableModel');
      if (order.table) {
        // order.table might be ObjectId or populated object; use id when possible
        const tableId = order.table._id ? order.table._id : order.table;
        await Table.findByIdAndUpdate(tableId, { status: 'Booked', currentOrder: order._id });
      } else if (order.tableNo) {
        // fallback: update by tableNo
        const Table = require('../models/tableModel');
        await Table.findOneAndUpdate({ tableNo: order.tableNo }, { status: 'Booked', currentOrder: order._id });
      }
    } catch (e) {
      console.error('Failed to update table status', e);
    }

    // return the saved order populated with table so frontend has table info
    const populatedOrder = await Order.findById(order._id).populate('table');
    res
      .status(201)
      .json({ success: true, message: "Order created!", data: populatedOrder });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const order = await Order.findById(id);
    if (!order) {
      const error = createHttpError(404, "Order not found!");
      return next(error);
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("table");
    res.status(200).json({ data: orders });
  } catch (error) {
    next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const { orderStatus, kotPrinted } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const updateFields = {};
    if (orderStatus !== undefined) updateFields.orderStatus = orderStatus;
    if (kotPrinted !== undefined) updateFields.kotPrinted = kotPrinted;

    const order = await Order.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    if (!order) {
      const error = createHttpError(404, "Order not found!");
      return next(error);
    }

    res
      .status(200)
      .json({ success: true, message: "Order updated", data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = { addOrder, getOrderById, getOrders, updateOrder };
