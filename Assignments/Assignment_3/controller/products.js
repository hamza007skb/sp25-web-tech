const express = require("express");
const router = express.Router();
const Product = require("../models/product_model");
const layout = require("express-ejs-layouts");

router.use(express.static("public"));
router.use(layout);

router.get("/products", async (req, res) => {
  const category = req.query.category;

  try {
    let products;

    if (category) {
      // Find products that match the category (case-insensitive)
      products = await Product.find({
        category: { $regex: new RegExp(`^${category}$`, "i") },
      });
    } else {
      // If no category provided, fetch all products
      products = await Product.find({});
    }

    res.render("products", {
      products,
      cssFile: true,
      css: "css/products.css",
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
