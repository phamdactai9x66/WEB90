const express = require("express");
const router = express.Router();
const CustomerController = require("../controller/customer.controller");
const Customer = require("../model/Customer.model");

// all router of customer

const checkExistCustomer = async (req, res, next) => {
  try {
    const getCustomer = await Customer.findOne({ _id: req.params.id });

    if (!getCustomer) {
      return res.status(404).send("Customer not found");
    }

    req.customerInfo = getCustomer;
    // Customer exist
    next();
  } catch (error) {
    res.status(500).send(error.message);
  }
};

router.get("/", CustomerController.getAllCustomer);

router.get("/:id", checkExistCustomer, CustomerController.getDetailCustomer);

router.get("/:customerId/orders", CustomerController.getCustomerByOrder);

router.post("/", CustomerController.createCustomer);

module.exports = router;
