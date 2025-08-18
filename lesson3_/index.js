const express = require("express");

const mongoose = require("mongoose");

const Customer = require("./model/Customer.model");
const Product = require("./model/Product.model");

const port = 3000;
const hostname = "localhost";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri = "";

app.get("/customers", async (req, res) => {
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
});

app.get("/customer/:id", async (req, res) => {
  try {
    const getCustomer = await Customer.findOne({ _id: req.params.id });

    if (!getCustomer) {
      return res.status(404).send("Customer not found");
    }

    res.send({
      status: 200,
      data: getCustomer,
      message: "successful",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/customers/:customerId/orders", async (req, res) => {
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
});

app.get("/products", async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;

    let query = {};

    if (minPrice && maxPrice) {
      query = {
        price: { $gt: minPrice, $lt: maxPrice },
      };
    }

    const getProducts = await Product.find(query);

    res.send({
      status: 200,
      data: getProducts,
      message: "successful",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/customer", async (req, res) => {
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
});

mongoose
  .connect(uri)
  .then((res) => {
    console.log("connected to database");
    app.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
