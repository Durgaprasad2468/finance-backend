const express = require("express");
const { body } = require("express-validator");
const { register, login, getMe } = require("../controllers/authController");
const { authenticate } = require("../middlewares/auth");
const validate = require("../middlewares/validate");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }),
    body("email").trim().isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").optional().isIn(["viewer", "analyst", "admin"]).withMessage("Invalid role"),
  ],
  validate,
  register
);

router.post(
  "/login",
  [
    body("email").trim().isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);

router.get("/me", authenticate, getMe);

module.exports = router;
