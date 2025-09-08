const mongoose = require("mongoose");

const PropertiesSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    area: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["sold", "selling", "canceled"],
      default: "selling",
    },
    managerId: mongoose.Schema.Types.ObjectId,
    accountId: mongoose.Schema.Types.ObjectId,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Properties", PropertiesSchema);
