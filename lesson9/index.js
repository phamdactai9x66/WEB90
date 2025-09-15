const express = require("express");

const mongoose = require("mongoose");

const Account = require("./router/account.router");
const Customers = require("./router/customers.router");
const Managers = require("./router/manager.router");
const Employees = require("./router/employees.router");

const hostname = "localhost";

const app = express();

const cors = require("cors");

app.use(cors());
app.use(express.json());

require("dotenv").config({
  path: ["./.env", "./.env.local"],
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/account", Account);

app.use("/customer", Customers);

app.use("/managers", Managers);

app.use("/employees", Employees);

mongoose
  .connect(process.env.URL_MONGODB)
  .then((res) => {
    console.log(process.env.URL_MONGODB);
    console.log("connected to database");
    app.listen(process.env.PORT, hostname, () => {
      console.log(`Server running at http://${hostname}:${process.env.PORT}/`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
