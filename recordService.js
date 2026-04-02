const Record = require("../models/Record");

class RecordService {
  /**
   * Create a new financial record
   */
  static async createRecord(data, userId) {
    const record = await Record.create({ ...data, createdBy: userId });
    return record;
  }

  /**
   * Get all records with filtering, sorting, and pagination
   */
  static async getRecords({ type, category, startDate, endDate, page = 1, limit = 10, sort = "-date" }) {
    const filter = { isDeleted: false };

    if (type) filter.type = type;
    if (category) filter.category = category.toLowerCase();
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const [records, total] = await Promise.all([
      Record.find(filter).populate("createdBy", "name email").skip(skip).limit(limit).sort(sort),
      Record.countDocuments(filter),
    ]);

    return {
      records,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  }

  /**
   * Get a single record by ID
   */
  static async getRecordById(id) {
    const record = await Record.findOne({ _id: id, isDeleted: false }).populate("createdBy", "name email");
    if (!record) {
      const error = new Error("Record not found");
      error.statusCode = 404;
      throw error;
    }
    return record;
  }

  /**
   * Update a record
   */
  static async updateRecord(id, data) {
    const record = await Record.findOneAndUpdate(
      { _id: id, isDeleted: false },
      data,
      { new: true, runValidators: true }
    );
    if (!record) {
      const error = new Error("Record not found");
      error.statusCode = 404;
      throw error;
    }
    return record;
  }

  /**
   * Soft delete a record
   */
  static async deleteRecord(id) {
    const record = await Record.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!record) {
      const error = new Error("Record not found");
      error.statusCode = 404;
      throw error;
    }
    return record;
  }
}

module.exports = RecordService;
