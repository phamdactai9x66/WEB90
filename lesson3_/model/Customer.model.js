const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  apiKey: String,
  createAt: Date,
  updateAt: Date,
});

module.exports = mongoose.model("Customer", CustomerSchema);
