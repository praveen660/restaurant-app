const express = require("express");
const authController = require("../Controllers/authController.js");

const router = express.Router();

router.post(
  "/signup",
  // authController.protect,
  // authController.restrictTo("superAdmin"),
  authController.createUser
);
router.post("/login", authController.userLogin);

module.exports = router;
