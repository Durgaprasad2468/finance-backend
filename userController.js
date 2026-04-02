const UserService = require("../services/userService");
const ApiResponse = require("../utils/apiResponse");

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Admin
 */
const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { users, pagination } = await UserService.getAllUsers({ page, limit });

    ApiResponse.paginated(res, users, pagination, "Users fetched");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Admin
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    ApiResponse.success(res, { user }, "User fetched");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user role
 * @route   PATCH /api/users/:id/role
 * @access  Admin
 */
const updateUserRole = async (req, res, next) => {
  try {
    const user = await UserService.updateUserRole(req.params.id, req.body.role);
    ApiResponse.success(res, { user }, "Role updated");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle user active/inactive status
 * @route   PATCH /api/users/:id/status
 * @access  Admin
 */
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await UserService.toggleUserStatus(req.params.id);
    ApiResponse.success(res, { user }, `User ${user.isActive ? "activated" : "deactivated"}`);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, getUserById, updateUserRole, toggleUserStatus };
