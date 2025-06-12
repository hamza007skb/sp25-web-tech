const express = require("express");
const router = express.Router();
const Order = require("../models/order_model");
const Product = require("../models/product_model");
const { model } = require("mongoose");

// POST /add-to-cart/:productId
router.post("/add-to-cart/:productId", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const productId = req.params.productId;
  const userId = req.session.user.id;

  try {
    await Order.create({ userId, productId });
    req.session.message = "Product added to cart!";
    res.redirect("/products"); // or `res.redirect("back")` to return to previous page
  } catch (error) {
    console.error("Add to cart error:", error);
    req.session.message = "Error adding product to cart.";
    res.redirect("/products");
  }
});

module.exports = router;
