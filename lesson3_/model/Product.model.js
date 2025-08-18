const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
  createAt: Date,
  updateAt: Date,
});

module.exports = mongoose.model("Product", ProductSchema);
