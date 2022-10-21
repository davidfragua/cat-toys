const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const userRoutes = require("./user.routes")
router.use("/user", userRoutes)

const toyRoutes = require("./toy.routes")
router.use("/toy", toyRoutes)

const authRoutes = require("./auth.routes")
router.use("/auth", authRoutes)

const commentRoutes = require("./comment.routes")
router.use("/comment", commentRoutes)

module.exports = router;
