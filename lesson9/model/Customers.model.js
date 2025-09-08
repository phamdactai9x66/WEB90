const mongoose = require("mongoose");

const CustomersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: String,
    address: String,

    apiKey: {
      type: String,
      required: true,
    },
    accountId: mongoose.Schema.Types.ObjectId,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customers", CustomersSchema);
