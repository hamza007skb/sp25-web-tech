const express = require("express");
const router = express.Router();
const Product = require("../models/product_model");
const layout = require("express-ejs-layouts");

router.use(express.static("public"));
router.use(layout);

router.get("/products", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const category = req.query.category;
  const message = req.session.message;
  delete req.session.message;

  try {
    let products;

    if (category) {
      products = await Product.find({
        category: { $regex: new RegExp(`^${category}$`, "i") },
      });
    } else {
      products = await Product.find({});
    }

    res.render("products", {
      products,
      cssFile: true,
      css: "css/products.css",
      message, // 🟢 Add message here
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
