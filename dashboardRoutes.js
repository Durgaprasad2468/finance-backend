const express = require("express");
const {
  getDashboardSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
} = require("../controllers/dashboardController");
const { authenticate, authorize } = require("../middlewares/auth");

const router = express.Router();

// Dashboard access: analyst and admin only
router.use(authenticate, authorize("analyst", "admin"));

router.get("/", getDashboardSummary);
router.get("/categories", getCategoryBreakdown);
router.get("/trends", getMonthlyTrends);

module.exports = router;
