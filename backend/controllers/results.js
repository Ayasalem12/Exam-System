const mongoose = require("mongoose");
const resultsModel = require("../models/results");
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const User = require("../models/user");

// get admin/allResults -> admin
exports.getAllResults = catchAsync(async (req, res, next) => {
  const results = await resultsModel.find().populate(["examId", "userId"]);

  // Map results to include user name
  const formattedResults = results.map((result) => ({
    ...result.toObject(),
    userName: result.userId ? result.userId.name : "Unknown",
  }));

  res
    .status(200)
    .json({ message: "Success get all results", data: formattedResults });
});

// get allresults/:userId -> user
exports.getUserResults = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new AppError(400, "Invalid User ID format"));
  }

  const userExists = await User.findById(userId);
  if (!userExists) {
    return next(new AppError(404, "User not found"));
  }

  if (userExists.role !== "student") {
    return next(new AppError(403, "Only students can view their own results"));
  }

  const results = await resultsModel
    .find({ userId: userId })
    .populate(["examId", "userId"])
    .sort({ submittedAt: -1 });

  // Filter out results where the examId reference is null and map the results
  const filteredResults = results.filter((result) => result.examId);

  res
    .status(200)
    .json({ message: "Success get user results", data: filteredResults });
});
