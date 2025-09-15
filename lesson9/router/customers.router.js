const express = require("express");
const router = express.Router();

const Account = require("../model/Account.model");

const Properties = require("../model/Properties.model");

const DepositOrders = require("../model/DepositOrders.model");

const Customers = require("../model/Customers.model");
const { checkAuthentication } = require("../service/utils");

router.post("/create_deposit_order", checkAuthentication, async (req, res) => {
  try {
    const accInfo = req.accountInfo;

    if (!accInfo.isActive || accInfo.role != "CUSTOMER") {
      return res.status(400).send({
        status: 400,
        message: "You are not customer",
      });
    }

    const checkProperty = await Properties.findOne({
      _id: req.body.propertyId,
    });

    if (!checkProperty) {
      return res.status(400).send({
        status: 400,
        message: "Property not found",
      });
    }

    if (["sold", "canceled"].includes(checkProperty.status)) {
      return res.status(400).send({
        status: 400,
        message: "Property is " + checkProperty.status,
      });
    }

    const addDepositOrder = await DepositOrders.insertOne({
      ...req.body,
      customerId: accInfo._id,
    });

    res.send({
      status: 200,
      data: addDepositOrder,
      message: "successful",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/:idAccount", async (req, res) => {
  try {
    const paramId = req.params.idAccount;

    const findAccount = await Account.findById(paramId);

    // check Exist Account
    if (!findAccount) {
      return res.status(400).send({
        status: 400,
        message: "Account not found",
      });
    }

    if (!findAccount.isActive) {
      return res.status(400).send({
        status: 400,
        message: "Account is inactive",
      });
    }

    const checkExistCustomer = await Customers.findOne({ accountId: paramId });

    // if exist Customer update Customer
    if (checkExistCustomer) {
      const updateCustomer = await Customers.findByIdAndUpdate(
        checkExistCustomer._id,
        {
          ...req.body,
        },
        {
          new: true,
        }
      );

      return res.send({
        status: 200,
        data: updateCustomer,
        message: "successful",
      });
    }

    // if exist Customer create Customer

    const newCustomer = await Customers.insertOne({
      ...req.body,
      accountId: paramId,
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

module.exports = router;
