const RecordService = require("../services/recordService");
const ApiResponse = require("../utils/apiResponse");

/**
 * @desc    Create a financial record
 * @route   POST /api/records
 * @access  Admin
 */
const createRecord = async (req, res, next) => {
  try {
    const record = await RecordService.createRecord(req.body, req.user._id);
    ApiResponse.success(res, { record }, "Record created", 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all records with filters and pagination
 * @route   GET /api/records
 * @access  Viewer, Analyst, Admin
 */
const getRecords = async (req, res, next) => {
  try {
    const { type, category, startDate, endDate, page, limit, sort } = req.query;
    const result = await RecordService.getRecords({
      type,
      category,
      startDate,
      endDate,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sort: sort || "-date",
    });

    ApiResponse.paginated(res, result.records, result.pagination, "Records fetched");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single record
 * @route   GET /api/records/:id
 * @access  Viewer, Analyst, Admin
 */
const getRecordById = async (req, res, next) => {
  try {
    const record = await RecordService.getRecordById(req.params.id);
    ApiResponse.success(res, { record }, "Record fetched");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a record
 * @route   PUT /api/records/:id
 * @access  Admin
 */
const updateRecord = async (req, res, next) => {
  try {
    const record = await RecordService.updateRecord(req.params.id, req.body);
    ApiResponse.success(res, { record }, "Record updated");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a record (soft delete)
 * @route   DELETE /api/records/:id
 * @access  Admin
 */
const deleteRecord = async (req, res, next) => {
  try {
    await RecordService.deleteRecord(req.params.id);
    ApiResponse.success(res, null, "Record deleted");
  } catch (error) {
    next(error);
  }
};

module.exports = { createRecord, getRecords, getRecordById, updateRecord, deleteRecord };
