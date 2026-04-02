const User = require("../models/User");

class UserService {
  /**
   * Get all users (admin only)
   */
  static async getAllUsers({ page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(),
    ]);

    return {
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  }

  /**
   * Get user by ID
   */
  static async getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  /**
   * Update user role (admin only)
   */
  static async updateUserRole(id, role) {
    const user = await User.findByIdAndUpdate(id, { role }, { new: true, runValidators: true });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  /**
   * Toggle user active status (admin only)
   */
  static async toggleUserStatus(id) {
    const user = await User.findById(id);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    user.isActive = !user.isActive;
    await user.save();
    return user;
  }
}

module.exports = UserService;
