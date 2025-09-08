const mongoose = require("mongoose");

const EmployeesSchema = new mongoose.Schema(
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
    department: String,
    managerId: mongoose.Schema.Types.ObjectId,
    accountId: mongoose.Schema.Types.ObjectId,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Employees", EmployeesSchema);
