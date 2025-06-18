const express = require("express");
const router = express.Router();
const Complaint = require("../models/complaint_model");
const { requireUser } = require("../middleware");

router.get("/complaint", requireUser, (req, res) => {
  const orderId = req.query.orderId;
  if (!orderId) {
    req.flash("error", "Order ID is missing");
    return res.redirect("/my-orders");
  }

  res.render("complaint", {
    cssFile: true,
    css: "css/form.css",
    orderId,
  });
});

router.post("/complaint", requireUser, async (req, res) => {
  const { message, orderId } = req.body;

  if (!orderId || !message) {
    req.flash("error", "All fields are required.");
    return res.redirect("/my-orders");
  }

  try {
    await Complaint.create({
      userId: req.session.user.id,
      orderId,
      message,
    });

    req.flash("success", "Complaint submitted successfully.");
    res.redirect("/my-orders");
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong.");
    res.redirect("back");
  }
});
router.get("/all-complaints", requireUser, async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.session.user.id })
      .populate("orderId")
      .sort({ createdAt: -1 });

    res.render("all_complaints", {
      complaints,
    });
  } catch (err) {
    console.error("Error fetching complaints:", err);
    req.flash("error", "Unable to fetch complaints.");
    res.redirect("/");
  }
});

module.exports = router;
