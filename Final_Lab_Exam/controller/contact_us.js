// const express = require("express");
// const router = express.Router();
// const Complaint = require("../models/complaint_model");
// const Order = require("../models/order_model");
// const { requireUser } = require("../middleware");

// router.get("/complaint/:orderId", async (req, res) => {
//   try {
//     const complaints = await Complaint.find({
//       userId: req.session.user._id,
//     }).populate("orderId");
//     res.render("complaint", {
//       complaints,
//       orderId: req.params.orderId,
//       success: req.flash("success"),
//       error: req.flash("error"),
//     });
//   } catch (err) {
//     console.error(err);
//     req.flash("error", "Unable to fetch complaints.");
//     res.redirect("/");
//   }
// });

// router.get("/complaints", requireUser, async (req, res) => {
//   try {
//     const complaints = await Complaint.find({ userId: req.session.user.id })
//       .populate("orderId")
//       .sort({ createdAt: -1 });
//   } catch (err) {
//     console.error("Error fetching complaints:", err);
//     res.status(500).send("Server Error");
//   }
// });
