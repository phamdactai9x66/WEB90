const mongoose = require("mongoose");

const DepositOrdersSchema = new mongoose.Schema(
  {
    customerId: mongoose.Schema.Types.ObjectId,
    propertyId: mongoose.Schema.Types.ObjectId,
    // date: {
    //   type: Date,
    //   required: true,
    // },
    status: {
      type: String,
      enum: ["done", "pending", "canceled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DepositOrders", DepositOrdersSchema);
