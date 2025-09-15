const express = require("express");
const { checkAuthentication } = require("../service/utils");
const router = express.Router();

const Property = require("../model/Properties.model");

router.post("/create_property", checkAuthentication, async (req, res) => {
  try {
    const accInfo = req.accountInfo;

    if (!accInfo.isActive || accInfo.role != "MANAGER") {
      return res.status(400).send({
        status: 400,
        message: "You are not manager",
      });
    }

    const newProperty = await Property.insertOne({
      ...req.body,
      managerId: accInfo._id,
    });

    res.send({
      status: 200,
      data: newProperty,
      message: "successful",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put("/edit_property/:id", checkAuthentication, async (req, res) => {
  try {
    const paramId = req.params.id;

    const accInfo = req.accountInfo;

    const checkExistProperty = await Property.findOne({ _id: paramId });

    if (!checkExistProperty) {
      return res.status(400).send({
        status: 400,
        message: "Property not found",
      });
    }

    if (!accInfo.isActive || accInfo.role != "MANAGER") {
      return res.status(400).send({
        status: 400,
        message: "You are not manager",
      });
    }

    const editProperty = await Property.findByIdAndUpdate(paramId, req.body, {
      new: true,
    });

    res.send({
      status: 200,
      data: editProperty,
      message: "successful",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// your routers
module.exports = router;
