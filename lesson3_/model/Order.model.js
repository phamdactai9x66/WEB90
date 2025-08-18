const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  customerId: mongoose.Schema.Types.ObjectId,
  productId: mongoose.Schema.Types.ObjectId,
  quantity: Number,
  totalPrice: Number,
  createAt: Date,
  updateAt: Date,
});

module.exports = mongoose.model("Order", OrderSchema);
