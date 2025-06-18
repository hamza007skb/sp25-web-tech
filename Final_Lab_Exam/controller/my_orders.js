// controller/my_orders.js
const express = require("express");
const router = express.Router();
const Order = require("../models/order_model");
const Product = require("../models/product_model");
const { requireUser } = require("../middleware");

router.get("/my-orders", requireUser, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.session.user.id }).populate(
      "products.product"
    );

    res.render("orders", {
      orders,
      cssFile: true,
      css: "css/orders.css",
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
