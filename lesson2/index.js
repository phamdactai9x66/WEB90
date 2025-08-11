const { orders, customers, products } = require("./constants");
const express = require("express");

const { v4: uuidv4 } = require("uuid");

const port = 8080;
const hostname = "localhost";

const app = express();

app.use(express.json());

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

app.post("/customers", (req, res) => {
  const { email } = req.body;

  const findUser = customers.find((customer) => customer.email === email);

  if (findUser) {
    return res.status(400).send({
      status: 400,
      data: {},
      message: "Email already exists",
    });
  }

  const body = {
    ...req.body,
    id: uuidv4(),
  };

  customers.push(body);

  res.send({
    status: 200,
    data: customers,
    message: "Success",
  });
});

app.post("/orders", (req, res) => {
  const { productId, quantity } = req.body;

  const findProduct = products.find((product) => product.id === productId);

  //   check exist product
  if (!findProduct) {
    return res.status(400).send({
      status: 400,
      data: {},
      message: "Product not found",
    });
  }

  //   check quantity in store
  if (req.body.quantity > findProduct.quantity) {
    return res.status(400).send({
      status: 400,
      data: {},
      message: "Quantity not enough",
    });
  }

  findProduct.quantity -= quantity;

  const body = {
    orderId: uuidv4(),
    ...req.body,
    totalPrice: findProduct.price * quantity,
  };

  orders.push(body);

  res.send({
    status: 200,
    data: orders,
    message: "Success",
  });
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
