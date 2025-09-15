const express = require("express");
const router = express.Router();
const CustomerController = require("../controller/customer.controller");
const Customer = require("../model/Customer.model");

const CryptoJS = require("crypto-js");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

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

router.post("/register", async (req, res) => {
  try {
    const body = req.body;

    const findCustomer = await Customer.findOne({ email: body.email });

    // find Cusomter
    if (findCustomer) {
      return res.status(400).send({
        status: 400,
        message: "Email already exists",
      });
    }

    // gen random string
    const randomString = bcrypt.genSaltSync(10);

    // hash Password
    const hashPassword = bcrypt.hashSync(body.password, randomString);

    // add new Customer
    const newCustomer = await Customer.insertOne({
      ...body,
      password: hashPassword,
    });

    res.send({
      status: 200,
      data: newCustomer,
      message: "successful",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const body = req.body;

    console.log(body);

    if (!body.email || !body.password) {
      return res.status(400).send({
        status: 400,
        message: "Email or password not invalid",
      });
    }

    const findCustomer = await Customer.findOne({ email: body.email });

    if (!findCustomer) {
      return res.status(400).send({
        status: 400,
        message: "Customer is no exist in our system",
      });
    }

    // const bytes = CryptoJS.AES.decrypt(body.password, "taiDz");

    // const originalText = bytes.toString(CryptoJS.enc.Utf8);

    // console.log(originalText);

    // if (!comparePassword) {
    //   return res.status(400).send({
    //     status: 400,
    //     message: "Password not invalid",
    //   });
    // }

    // const newApiKey = `web-$${findCustomer._id}$-$${
    //   findCustomer.email
    // }$-$${uuidv4()}$`;

    const updateApiKey = await Customer.findByIdAndUpdate(
      findCustomer._id,
      {
        apiKey: newApiKey,
      },
      {
        new: true,
      }
    );

    const genAccessToken = jwt.sign(
      {
        _id: findCustomer._id,
        email: findCustomer.email,
        name: findCustomer.name,
        token_type: "AT",
      },
      process.env.SECRET_KEY,
      {
        expiresIn: process.env.EXPIRED_ACCESS_TOKEN,
      }
    );

    const getRefreshToken = jwt.sign(
      {
        _id: findCustomer._id,
        email: findCustomer.email,
        name: findCustomer.name,
        token_type: "RT",
      },
      process.env.SECRET_KEY,
      {
        expiresIn: process.env.EXPIRED_REFRESH_TOKEN,
      }
    );

    res.send({
      status: 200,
      data: {
        email: findCustomer.email,
        access_token: genAccessToken,
        refresh_token: getRefreshToken,
        // apiKey: updateApiKey.apiKey,
      },
      message: "successful",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
