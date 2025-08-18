const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    require: true,
  },
  age: {
    type: Number,
    min: 1,
    max: 100,
  },
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
  idFriend: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model("Customer", customerSchema);
