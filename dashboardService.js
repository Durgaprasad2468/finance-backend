const Record = require("../models/Record");

class DashboardService {
  /**
   * Get complete dashboard summary
   */
  static async getSummary() {
    const [totals, categoryBreakdown, recentTransactions, monthlyTrends] = await Promise.all([
      this.getTotals(),
      this.getCategoryBreakdown(),
      this.getRecentTransactions(),
      this.getMonthlyTrends(),
    ]);

    return {
      ...totals,
      categoryBreakdown,
      recentTransactions,
      monthlyTrends,
    };
  }

  /**
   * Get total income, expenses, and net balance
   */
  static async getTotals() {
    const result = await Record.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;
    result.forEach((item) => {
      if (item._id === "income") totalIncome = item.total;
      if (item._id === "expense") totalExpense = item.total;
    });

    return {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
    };
  }

  /**
   * Get category-wise breakdown of income and expenses
   */
  static async getCategoryBreakdown() {
    const result = await Record.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: { type: "$type", category: "$category" },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    return result.map((item) => ({
      type: item._id.type,
      category: item._id.category,
      total: item.total,
      count: item.count,
    }));
  }

  /**
   * Get 10 most recent transactions
   */
  static async getRecentTransactions() {
    return Record.find({ isDeleted: false })
      .populate("createdBy", "name email")
      .sort({ date: -1 })
      .limit(10);
  }

  /**
   * Get monthly income/expense trends for the last 12 months
   */
  static async getMonthlyTrends() {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const result = await Record.aggregate([
      {
        $match: {
          isDeleted: false,
          date: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    return result.map((item) => ({
      year: item._id.year,
      month: item._id.month,
      type: item._id.type,
      total: item.total,
    }));
  }
}

module.exports = DashboardService;
