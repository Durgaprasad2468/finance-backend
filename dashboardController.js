const DashboardService = require("../services/dashboardService");
const ApiResponse = require("../utils/apiResponse");

/**
 * @desc    Get full dashboard summary
 * @route   GET /api/dashboard
 * @access  Analyst, Admin
 */
const getDashboardSummary = async (req, res, next) => {
  try {
    const summary = await DashboardService.getSummary();
    ApiResponse.success(res, summary, "Dashboard summary fetched");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get category-wise breakdown
 * @route   GET /api/dashboard/categories
 * @access  Analyst, Admin
 */
const getCategoryBreakdown = async (req, res, next) => {
  try {
    const breakdown = await DashboardService.getCategoryBreakdown();
    ApiResponse.success(res, breakdown, "Category breakdown fetched");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get monthly trends
 * @route   GET /api/dashboard/trends
 * @access  Analyst, Admin
 */
const getMonthlyTrends = async (req, res, next) => {
  try {
    const trends = await DashboardService.getMonthlyTrends();
    ApiResponse.success(res, trends, "Monthly trends fetched");
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardSummary, getCategoryBreakdown, getMonthlyTrends };
