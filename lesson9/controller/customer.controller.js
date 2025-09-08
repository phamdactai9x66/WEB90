const Customer = require("../model/Customer.model");
const Order = require("../model/Order.model");

const getAllCustomer = async (req, res) => {
  try {
    const getCustomer = await Customer.find({});

    res.send({
      status: 200,
      data: getCustomer,
      message: "successful",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getDetailCustomer = async (req, res) => {
  try {
    const customerInfo = req?.customerInfo || {};

    res.send({
      status: 200,
      data: customerInfo,
      message: "successful",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getCustomerByOrder = async (req, res) => {
  try {
    const getOrders = await Order.find({ customerId: req.params.customerId });

    res.send({
      status: 200,
      data: getOrders,
      message: "successful",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const createCustomer = async (req, res) => {
  try {
    const body = req.body;

    const findCustomer = await Customer.find({ email: body.email });

    if (findCustomer.length) {
      return res.status(404).send({
        status: 404,
        message: "Email already exists",
      });
    }

    const newCustomer = await Customer.insertOne(body);

    res.send({
      status: 200,
      data: newCustomer,
      message: "successful",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  getAllCustomer,
  getDetailCustomer,
  getCustomerByOrder,
  createCustomer,
};
