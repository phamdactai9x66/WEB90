const { orders, customers, products } = require("./constants");
const express = require("express");

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

// bai7
app.post("/customers", async (req, res) => {
  try {
    const { email, name, age } = req.body;

    const { data: findUser } = await axios.get(`/customers?email=${email}`);

    if (findUser.length > 0) {
      return res.status(400).send({
        status: 400,
        data: {},
        message: "Email already exists",
      });
    }

    const body = {
      name: name,
      email: email,
      age: age,
    };

    const data = await axios.post(`/customers`, body);

    res.send({
      status: 200,
      data: data.data,
      message: "Success",
    });
  } catch (error) {}
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

app.put("/orders/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const { quantity } = req.body;

  const { data: findOrder } = await axios.get(`/orders?id=${orderId}`);

  if (!findOrder.length) {
    return res.status(400).send({
      status: 400,
      data: {},
      message: "Order not found",
    });
  }

  const idProduct = findOrder[0].productId;

  const { data: findProduct } = await axios.get(`/products/${idProduct}`);

  const body = {
    ...findOrder[0],
    quantity: quantity,
    totalPrice: findProduct.price * quantity,
  };

  res.send({
    status: 200,
    data: {},
    message: "Success",
  });
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
