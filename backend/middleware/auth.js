const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const { catchAsync } = require("../utils/catchAsync");

exports.auth = catchAsync((req, res, next) => {
  let { authorization } = req.headers;
  if (!authorization) {
    return next(new AppError(401, "please login first", "fail"));
  }
  const token = authorization.split(" ")[1];
  let decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.id = decoded.id;
  req.role = decoded.role;
  console.log("User:",req.id);
  console.log("Role:",req.role);
  next();
});

exports.restrictTo = (...roles) => {
  return catchAsync(async (req, res, next) => {
    if (!roles.includes(req.role)) {
      return next(
        new AppError(403, "No permission to perform this action", "fail")
      );
    }
    next();
  });
};
