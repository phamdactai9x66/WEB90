const express = require("express");
const router = express.Router();
const CustomerController = require("../controller/customer.controller");
const Customer = require("../model/Customer.model");

const { checkAuthentication } = require("../service/utils");

const { v4: uuidv4 } = require("uuid");

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

router.get("/", checkAuthentication, CustomerController.getAllCustomer);

router.get("/:id", CustomerController.getDetailCustomer);

router.get("/:customerId/orders", CustomerController.getCustomerByOrder);

router.post("/", CustomerController.createCustomer);

router.post("/getApiKey/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;

    // check params ID exist
    if (!customerId) {
      return res.status(404).send("CustomerId not found");
    }

    // check Customer exist

    const checkExistCustomer = await Customer.findById(customerId);

    if (!checkExistCustomer) {
      return res.status(404).send("Customer not found");
    }

    const newApiKey = `web-$${customerId}$-$${
      checkExistCustomer.email
    }$-$${uuidv4()}$`;

    const updateApiKey = await Customer.findByIdAndUpdate(
      customerId,
      {
        apiKey: newApiKey,
      },
      {
        new: true,
      }
    );

    res.send({
      status: 200,
      data: updateApiKey,
      message: "successful",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
