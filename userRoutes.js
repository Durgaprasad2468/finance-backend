const express = require("express");
const { body } = require("express-validator");
const { getAllUsers, getUserById, updateUserRole, toggleUserStatus } = require("../controllers/userController");
const { authenticate, authorize } = require("../middlewares/auth");
const validate = require("../middlewares/validate");

const router = express.Router();

// All user management routes require admin access
router.use(authenticate, authorize("admin"));

router.get("/", getAllUsers);
router.get("/:id", getUserById);

router.patch(
  "/:id/role",
  [body("role").isIn(["viewer", "analyst", "admin"]).withMessage("Invalid role")],
  validate,
  updateUserRole
);

router.patch("/:id/status", toggleUserStatus);

module.exports = router;
