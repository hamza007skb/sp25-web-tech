// routes/cart.js
const express = require("express");
const router = express.Router();
const Order = require("../models/order_model");
const Product = require("../models/product_model");
const { requireUser } = require("../middleware");

// Add to cart
router.post("/add-to-cart/:productId", requireUser, async (req, res) => {
  const productId = req.params.productId;
  let category = "";

  if (!req.session.cart) req.session.cart = [];

  const existing = req.session.cart.find(
    (item) => item.product._id == productId
  );

  if (existing) {
    existing.quantity++;
  } else {
    const product = await Product.findById(productId);
    if (product) {
      req.session.cart.push({ product, quantity: 1 });
      category = product.category;
    }
  }
  let redirectUrl = category ? `/products?category=${category}` : "/products";
  return res.redirect(redirectUrl);
});

// View Cart
router.get("/cart", requireUser, (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  res.render("cart", {
    cart,
    total,
    cssFile: true,
    css: "css/cart.css",
  });
});

// Update quantity
router.post("/cart/update", requireUser, (req, res) => {
  let { quantities, remove } = req.body;
  let cart = req.session.cart || [];

  if (!Array.isArray(quantities)) quantities = [quantities];
  if (!remove) remove = [];
  if (!Array.isArray(remove)) remove = [remove];

  quantities = quantities.map((q) => parseInt(q));
  remove = remove.map((r) => parseInt(r));

  cart.forEach((item, i) => {
    if (!isNaN(quantities[i]) && quantities[i] > 0) {
      item.quantity = quantities[i];
    }
  });

  req.session.cart = cart.filter((_, i) => !remove.includes(i));

  res.redirect("/cart");
});

// Checkout (GET)
router.get("/checkout", requireUser, (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  res.render("checkout", {
    cart,
    total,
    cssFile: true,
    css: "css/checkout.css",
  });
});

// Place Order (POST)
router.post("/api/checkout", requireUser, async (req, res) => {
  if (!req.session.user || !req.session.cart || req.session.cart.length === 0) {
    return res
      .status(400)
      .json({ error: "You're not logged in or your cart is empty." });
  }

  const { customer_name, customer_contact, customer_address, total } = req.body;

  if (!customer_name || !customer_contact || !customer_address) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const cart = req.session.cart;

    const order = new Order({
      userId: req.session.user.id,
      customer_name,
      customer_contact,
      customer_address,
      products: cart.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      total: total,
    });

    await order.save();
    req.session.cart = [];

    res.status(200).json({ message: "Order placed successfully!" });
  } catch (err) {
    console.error("Order error:", err);
    res.status(500).json({ error: "Server error while placing order." });
  }
});

module.exports = router;
