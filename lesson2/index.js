const { orders, products } = require("./constants");
const express = require("express");

const mongoose = require("mongoose");

const Customers = require("./model/customers.modal");

const axios = require("./service/api");

const { v4: uuidv4 } = require("uuid");

const port = 3000;
const hostname = "localhost";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// bai1
app.get("/orders", async (req, res) => {
  try {
    const { data } = await axios.get("/orders");

    res.send({
      status: 200,
      data,
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
app.get("/customers/:id", async (req, res) => {
  try {
    const { data: findUser } = await axios.get(`/customers/${req.params.id}`);

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

app.get("/customers/:customerId/orders", async (req, res) => {
  try {
    const paramId = req.params.customerId;

    const { data: customerOrders } = await axios.get(
      `/orders?customerId=${paramId}`
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

app.get("/orders/highvalue", async (req, res) => {
  try {
    const { data: highValueOrders } = await axios.get(
      "/orders?totalPrice_gt=10000000"
    );

    res.send({
      status: 200,
      data: highValueOrders,
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

app.get("/products", (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;

    if (!minPrice && !maxPrice) {
      return res.send({
        status: 200,
        data: products,
        message: "Success",
      });
    }

    const rangePrice = products.filter((product) => {
      return product.price >= minPrice && product.price <= maxPrice;
    });

    res.send({
      status: 200,
      data: rangePrice,
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

// GET, POST, PUT, DELETE

app.post("/customer", async (req, res) => {
  try {
    const { email } = req.body;

    const checkExist = await Customers.find({ email: email });

    if (checkExist.length) {
      return res.status(400).send({
        status: 400,
        data: {},
        message: "Email already exist",
      });
    }

    const newCustomer = await Customers.insertOne(req.body);

    res.send({
      status: 200,
      data: newCustomer,
      message: "Success",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.put("/customer/:id", async (req, res) => {
  try {
    const paramId = req.params.id;
    const checkExist = await Customers.find({ _id: paramId });

    if (!checkExist.length) {
      return res.status(400).send({
        status: 400,
        data: {},
        message: "Customer is not Found",
      });
    }

    const newCustomer = await Customers.findOneAndUpdate(
      { _id: paramId },
      req.body
    );

    res.send({
      status: 200,
      data: newCustomer,
      message: "Success",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/customers", async (req, res) => {
  try {
    const { page_id = 1, page_size = 20 } = req.query;

    const start = (page_id - 1) * page_size;

    const getUser = await Customers.find({
      age: {
        $gt: 17,
        $lt: 21,
      },
    })
      .skip(start)
      .limit(page_size);

    res.send({
      status: 200,
      data: getUser,
      message: "Success",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const uri =
  "mongodb+srv://tai15122003311:59TKXjeUebvlf1NM@cluster0.o7qe0oq.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";

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
