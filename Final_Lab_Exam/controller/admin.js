const express = require("express");
const router = express.Router();
const products = require("../models/product_model");
const orders = require("../models/order_model");
const { requireAdmin } = require("../middleware");
const multer = require("multer");
const path = require("path");
const users = require("../models/user_model");
const Complaint = require("../models/complaint_model");

// file uploading
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });

// show dashboard
router.get("/admin", requireAdmin, async (req, res) => {
  productsList = await products.find();
  return res.render("admin/dashboard", {
    products: productsList,
    layout: "admin/layout",
  });
});

// show orders
router.get("/admin/orders", requireAdmin, async (req, res) => {
  try {
    const orderList = await orders
      .find()
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.render("admin/admin_orders", {
      orders: orderList,
      cssFile: true,
      css: "css/newlook.css",
      layout: "admin/layout",
      userId: "",
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to load orders.");
    res.redirect("/");
  }
});
// update status
router.post("/admin/orders/:id/status", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const userId = req.query.userId || "";

  try {
    await orders.findByIdAndUpdate(id, { status });
    req.flash("success", "Order status updated.");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to update order.");
  }

  if (userId) {
    return res.redirect(`/admin/users/${userId}/orders`);
  }
  return res.redirect("/admin/orders");
});
// GET: Show Add Product Form
router.get("/admin/add", requireAdmin, (req, res) => {
  res.render("admin/admin_add_product", {
    layout: "admin/layout",
  });
});

// POST: Create Product
router.post(
  "/admin/add",
  requireAdmin,
  upload.single("image"),
  async (req, res) => {
    const { title, description, category, price } = req.body;
    const image = req.file ? "/images/" + req.file.filename : "";

    try {
      await products.create({ title, description, image, category, price });
      req.flash("success", "Product added successfully.");
      res.redirect("/admin");
    } catch (err) {
      console.error(err);
      req.flash("error", "Failed to add product.");
      res.redirect("/admin/add");
    }
  }
);

// GET: Show Edit Form
router.get("/admin/:id/edit", requireAdmin, async (req, res) => {
  const product = await products.findById(req.params.id);
  if (!product) {
    req.flash("error", "Product not found.");
    return res.redirect("/admin");
  }
  res.render("admin/admin_edit_product", { product, layout: "admin/layout" });
});

// PUT: Update Product
router.post(
  "/admin/:id/edit",
  requireAdmin,
  upload.single("image"),
  async (req, res) => {
    const { title, description, category, price } = req.body;
    const update = { title, description, category, price };

    if (req.file) {
      update.image = "/images/" + req.file.filename;
    }

    try {
      await products.findByIdAndUpdate(req.params.id, update);
      req.flash("success", "Product updated successfully.");
      res.redirect("/admin");
    } catch (err) {
      console.error(err);
      req.flash("error", "Failed to update product.");
      res.redirect(`/admin/${req.params.id}/edit`);
    }
  }
);

// DELETE: Delete Product
router.post("/admin/:id/delete", requireAdmin, async (req, res) => {
  try {
    await products.findByIdAndDelete(req.params.id);
    req.flash("success", "Product deleted.");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to delete product.");
  }
  return res.redirect("/admin");
});

router.get("/admin/get-users", requireAdmin, async (req, res) => {
  const userList = await users.find({ role: "user" });
  return res.render("admin/admin_users", {
    users: userList,
    layout: "admin/layout",
  });
});

router.get("/admin/users/:id/orders", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const ordersList = await orders.find({ userId: id });

  return res.render("admin/admin_orders", {
    orders: ordersList,
    layout: "admin/layout",
    userId: id,
  });
});

router.get("/admin/complaints", requireAdmin, async (req, res) => {
  try {
    const complaints = await Complaint.find({})
      .populate("userId", "username")
      .populate({
        path: "orderId",
        populate: {
          path: "products.product", // to get product details
        },
      })
      .sort({ createdAt: -1 });

    res.render("admin/admin_complaints", {
      layout: "admin/layout",
      complaints,
    });
  } catch (err) {
    console.error("Error fetching complaints:", err);
    req.flash("error", "Unable to fetch complaints.");
    res.redirect("/");
  }
});
module.exports = router;
