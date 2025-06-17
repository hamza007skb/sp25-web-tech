const express = require("express");
const router = express.Router();
const User = require("../models/user_model");
const bcrypt = require("bcryptjs");
const { requireUser } = require("../middleware");

router.get("/signup", (req, res) => {
  return res.render("forms", {
    layout: false,
    cssFile: true,
    css: "css/forms.css",
    jsFile: true,
    js: "js/forms.js",
  });
});
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).send("User created successfully");
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).send("Server Error");
  }
});

router.get("/login", (req, res) => {
  return res.render("login", {
    layout: false,
    jsFile: true,
    js: "js/login.js",
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role,
    };

    return res.status(200).json({ message: "Login successful" }); // ✅ send JSON
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Server Error" }); // ✅ send JSON
  }
});

router.get("/logout", requireUser, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).send("Server Error");
    }
    return res.redirect("/login");
  });
});
module.exports = router;
