const express = require("express");
const layout = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");

const server = express();

server.use(express.static("public"));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(layout);
server.set("view engine", "ejs");

server.use(
  session({
    secret: "my_super_key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);

server.use(require("./controller/auth"));
server.use(require("./controller/products"));

server.get("/", (req, res) => {
  return res.render("newlook", {
    cssFile: true,
    css: "css/newlook.css",
  });
});

mongoose
  .connect(
    "mongodb+srv://hamzaahmadskb:1234@webtech.znbonla.mongodb.net/webtech?retryWrites=true&w=majority"
  )
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
