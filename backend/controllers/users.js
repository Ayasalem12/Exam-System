const User = require("../models/user");
const AppError = require("../utils/AppError");
const bcryptjs = require("bcryptjs");
const { catchAsync } = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { expression } = require("joi");

exports.register = catchAsync(async (req, res, next) => {
  let user = await User.create(req.body);
  if (!user) {
    return next(new AppError("Failed to create user", 400));
  }

  res.status(201).json({
    status: "success",
    data: user,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return next(
      new AppError(400, "you must provide email and password for login", "fail")
    );
  }
  let user = await User.findOne({ email });
  if (!user) {
    return next(new AppError(401, "user not found", "fail"));
  }
  let isValid = await bcryptjs.compare(password, user.password);
  if (!isValid) {
    return next(new AppError(401, "invalid email or password", "fail"));
  }
  let token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET
  );

  res.status(200).json({ status: "success", token: token });
});

exports.getUser = catchAsync(async (req, res, next) => {
  let user = await User.findById(req.id).select("-password -__v"); // Exclude password and __v from the response
  if (!user) {
    return next(new AppError(404, "user not found", "fail"));
  }
  res.status(200).json({ status: "success", data: user });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  let id = req.id;
  let user = await User.findByIdAndUpdate(id, req.body);
  if (!user) {
    return next(new AppError(404, "user not found", "fail"));
  }
  res.status(200).json({ status: "success", data: user });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  let id = req.id;
  let user = await User.findByIdAndDelete(id);
  if (!user) {
    return next(new AppError(404, "user not found", "fail"));
  }
  res.status(204).json({ status: "success", data: null });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  let users = await User.find().select("-password -__v"); // Exclude password and __v from the response
  if (!users || users.length === 0) {
    return next(new AppError(404, "No users found", "fail"));
  }
  res.status(200).json({ status: "success", data: users });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  let id = req.id;
  let user = await User.findById(id).select("-password -__v"); // Exclude password and __v from the response
  if (!user) {
    return next(new AppError(404, "user not found", "fail"));
  }
  res.status(200).json({ status: "success", data: user });
});
