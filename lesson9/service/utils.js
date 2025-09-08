const AccountModel = require("../model/Account.model");
const jwt = require("jsonwebtoken");

const checkAuthentication = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;

    // check api key exist
    if (!accessToken) {
      return res.status(400).send("accessToken not found");
    }

    const decode = jwt.verify(accessToken, process.env.SECRET_KEY);

    if (decode.tokenType != "AT") {
      return res.status(400).send({
        status: 200,
        message: "Access Token is invalid",
      });
    }

    console.log(decode);

    const findCustomer = await AccountModel.findById(decode.id);

    if (!findCustomer) {
      return res.status(404).send("Customer not found");
    }

    next();
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  checkAuthentication,
};
