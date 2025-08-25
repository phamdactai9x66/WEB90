const Customer = require("../model/Customer.model");

const checkAuthentication = async (req, res, next) => {
  try {
    const apiKey = req.query.apiKey;

    // check api key exist
    if (!apiKey) {
      return res.status(400).send("apiKey not found");
    }

    const parsedApiKey = apiKey.split("$");

    // check validation format api key
    if (parsedApiKey.length != 7 || parsedApiKey[0] !== "web-") {
      return res.status(400).send("apiKey not valid");
    }

    const customerId = parsedApiKey[1];

    const findCustomer = await Customer.findById(customerId);

    if (!findCustomer) {
      return res.status(404).send("Customer not found");
    }

    // apiKey in local FE, apiKey in server

    if (apiKey != findCustomer.apiKey) {
      return res.status(401).send("Authorization failed");
    }

    next();
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  checkAuthentication,
};
