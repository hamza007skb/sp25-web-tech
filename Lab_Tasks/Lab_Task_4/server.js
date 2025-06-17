require("dotenv").config();
const express = require("express");
const layout = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");

const server = express();

server.use(express.static("public"));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(layout);
server.set("view engine", "ejs");

server.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);
server.use(flash());

server.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

server.use(require("./controller/auth"));
server.use(require("./controller/products"));
server.use(require("./controller/my_orders"));
server.use(require("./controller/cart"));
server.use(require("./controller/admin"));

server.get("/", (req, res) => {
  return res.render("newlook", {
    cssFile: true,
    css: "css/newlook.css",
  });
});

mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// ===== Start Server =====
server.listen(4000, () => {
  console.log("Server Started at http://localhost:4000");
});
