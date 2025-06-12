// controller/orders.js
const express = require("express");
const router = express.Router();
const Order = require("../models/order_model");
const Product = require("../models/product_model");

router.get("/my-orders", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  try {
    const orders = await Order.find({ userId: req.session.user.id }).populate(
      "productId"
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
