// const Customer = require("../model/Customer.model");
// const Order = require("../model/Order.model");
const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { minPrice, maxPrice, pageId = 1, pageSize = 20 } = req.query;

    let query = {};

    // pagination
    const startItem = (pageId - 1) * pageSize;

    // filter the condition
    if (minPrice && maxPrice) {
      query = {
        price: { $gt: minPrice, $lt: maxPrice },
      };
    }

    const totalProduct = await Product.countDocuments();

    const total_pages = Math.ceil(totalProduct / pageSize);

    const getProducts = await Product.find(query)
      .skip(startItem)
      .limit(pageSize);

    res.send({
      data: getProducts,
      total_items: totalProduct,
      current_page: +pageId,
      total_pages,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
