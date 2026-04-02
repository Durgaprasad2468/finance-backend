const AuthService = require("../services/authService");
const ApiResponse = require("../utils/apiResponse");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const { user, token } = await AuthService.register({ name, email, password, role });

    ApiResponse.success(res, { user, token }, "User registered successfully", 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await AuthService.login({ email, password });

    ApiResponse.success(res, { user, token }, "Login successful");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged-in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  ApiResponse.success(res, { user: req.user }, "Profile fetched");
};

module.exports = { register, login, getMe };
