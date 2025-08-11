const { orders, customers } = require("./constants");
const express = require("express");

const port = 8080;
const hostname = "localhost";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// bai1
app.get("/orders", (req, res) => {
  try {
    res.send({
      status: 200,
      data: orders,
      message: "Success",
    });
  } catch (error) {
    // exception
    res.send({
      status: 500,
      message: error.message,
    });
  }
});

// bai2
app.get("/customers/:id", (req, res) => {
  try {
    const findUser = customers.find(
      (customer) => customer.id === req.params.id
    );

    if (!findUser) {
      return res.status(404).send({
        status: 404,
        data: {},
        message: "no Found User",
      });
    }

    res.send({
      status: 200,
      data: findUser,
      message: "Success",
    });
  } catch (error) {
    // exception
    res.send({
      status: 500,
      message: error.message,
    });
  }
});

app.get("/customers/:customerId/orders", (req, res) => {
  try {
    const paramId = req.params.customerId;

    const customerOrders = orders.filter(
      (order) => order.customerId === paramId
    );

    res.send({
      status: 200,
      data: customerOrders,
      message: "Success",
    });
  } catch (error) {
    // exception
    res.send({
      status: 500,
      message: error.message,
    });
  }
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
