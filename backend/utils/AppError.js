class AppError extends Error {
  constructor(statusCode, message, status) {
    console.log("object");
    super(message);
    this.statusCode = statusCode;
    this.status =
      status || (statusCode >= 400 && statusCode < 500 ? "fail" : "error");
  }
}
module.exports = AppError;
