const express = require("express");

const router = express.Router();

const Account = require("../model/Account.model");

const jwt = require("jsonwebtoken");

const saltRounds = 10;

const bcrypt = require("bcrypt");
const AccountModel = require("../model/Account.model");
const { checkAuthentication } = require("../service/utils");

router.get("/", async (req, res) => {
  try {
    const {
      minPrice,
      maxPrice,
      pageId = 1,
      pageSize = 20,
      search,
      sort_key,
      sort_type,
    } = req.query;

    let query = {};

    // pagination
    const startItem = (pageId - 1) * pageSize;

    const totalProduct = await Account.countDocuments();

    const total_pages = Math.ceil(totalProduct / pageSize);

    // filter the condition
    if (minPrice && maxPrice) {
      query = {
        price: { $gt: minPrice, $lt: maxPrice },
      };
    }

    if (search) {
      query = {
        ...query,
        email: {
          $regex: search,
          $options: "i",
        },
      };
    }

    const getAccount = await Account.find(query)
      .skip(startItem)
      .limit(pageSize)
      .sort(sort_key && sort_type ? { [sort_key]: sort_type } : {});

    res.send({
      data: getAccount,
      total_items: totalProduct,
      current_page: +pageId,
      total_pages,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/register", async (req, res) => {
  try {
    const body = req.body;

    const findAccount = await Account.findOne({ email: body.email });

    if (findAccount) {
      return res.status(400).send({
        status: 400,
        message: "Email already exists",
      });
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    // thực hiện mã hoá với chuỗi salt
    const hash = bcrypt.hashSync(body.password, salt);

    const bodyAccount = {
      ...body,
      password: hash,
    };

    const newAccount = await Account.insertOne(bodyAccount);

    res.send({
      status: 200,
      data: newAccount,
      message: "successful",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const body = req.body;

    const findAccount = await Account.findOne({ email: body.email });

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

    // check Password
    const comparePassword = bcrypt.compareSync(
      body.password,
      findAccount.password
    );

    if (!comparePassword) {
      return res.status(400).send({
        status: 400,
        message: "Password not invalid",
      });
    }

    const userInfo = {
      id: findAccount._id,
      email: findAccount.email,
      name2: findAccount.name,
    };

    const userData = {
      ...userInfo,
      tokenType: "AT",
    };

    const userData2 = {
      ...userInfo,
      tokenType: "RT",
    };

    // gen Access Token
    const genAccessToken = jwt.sign(userData, process.env.SECRET_KEY, {
      expiresIn: "20m",
    });

    // gen Access Token
    const genRefreshToken = jwt.sign(userData2, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });

    // api key
    res.send({
      status: 200,
      data: {
        _id: findAccount._id,
        email: findAccount.email,
        name: findAccount.name,
        access_token: genAccessToken,
        refresh_token: genRefreshToken,
      },
      message: "successful",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// checkAuthentication
router.get("/:idAccount", checkAuthentication, async (req, res) => {
  try {
    const paramId = req.params.idAccount;

    const findAccount = await AccountModel.findById(paramId);

    if (!findAccount) {
      return res.status(400).send({
        status: 400,
        message: "Account not found",
      });
    }

    return res.send({
      status: 200,
      data: findAccount,
      message: "successful",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
