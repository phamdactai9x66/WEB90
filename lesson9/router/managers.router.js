const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const Account = require("../model/Account.model");
const Employees = require("../model/Employees.model");
const bcrypt = require("bcrypt");

router.post("/create_employees", async (req, res) => {
  try {
    const body = req.body;

    const accessToken = req.headers.authorization;

    const decode = jwt.verify(accessToken, process.env.SECRET_KEY);

    const findAccount = await Account.findById(decode.id);

    if (findAccount.role != "MANAGER") {
      return res.status(400).send({
        status: 400,
        message: "You don't have permission to access this request",
      });
    }

    // create Account for employee
    const salt = bcrypt.genSaltSync(10);
    // thực hiện mã hoá với chuỗi salt
    const hash = bcrypt.hashSync(body.password, salt);

    const bodyAccount = {
      email: body.email,
      password: hash,
      role: "EMPLOYEE",
    };

    const newAccount = await Account.insertOne(bodyAccount);

    // create info for employee

    const bodyInfoEmployee = {
      managerId: decode.id,
      accountId: newAccount._id,
      name: body.name,
      email: body.email,
      phone: body.phone,
      department: body.department,
    };

    const newEmployee = await Employees.insertOne(bodyInfoEmployee);

    res.send({
      status: 200,
      data: {
        newAccount: newAccount,
        newEmployee: newEmployee,
      },
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
