const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    require: true,
  },
  age: Number,
  password: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Customer", customerSchema);
