const User = require("../models/User");
const generateToken = require("../utils/generateToken");

class AuthService {
  /**
   * Register a new user
   */
  static async register({ name, email, password, role }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("Email already registered");
      error.statusCode = 409;
      throw error;
    }

    const user = await User.create({ name, email, password, role: role || "viewer" });
    const token = generateToken(user._id);

    return { user, token };
  }

  /**
   * Login an existing user
   */
  static async login({ email, password }) {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    if (!user.isActive) {
      const error = new Error("Account is deactivated. Contact an admin.");
      error.statusCode = 403;
      throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken(user._id);
    return { user, token };
  }
}

module.exports = AuthService;
