const express = require("express");
const { body } = require("express-validator");
const {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} = require("../controllers/recordController");
const { authenticate, authorize } = require("../middlewares/auth");
const validate = require("../middlewares/validate");

const router = express.Router();

// All record routes require authentication
router.use(authenticate);

// Read access: all roles
router.get("/", getRecords);
router.get("/:id", getRecordById);

// Write access: admin only
const recordValidation = [
  body("amount").isFloat({ min: 0.01 }).withMessage("Amount must be greater than 0"),
  body("type").isIn(["income", "expense"]).withMessage("Type must be income or expense"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("date").optional().isISO8601().withMessage("Invalid date format"),
  body("note").optional().isLength({ max: 500 }).withMessage("Note cannot exceed 500 characters"),
];

router.post("/", authorize("admin"), recordValidation, validate, createRecord);
router.put("/:id", authorize("admin"), recordValidation, validate, updateRecord);
router.delete("/:id", authorize("admin"), deleteRecord);

module.exports = router;
