class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith("4") ? "Failed" : "error";
      // this.isOperational = true;
      Error(this, this.constructor);
    }
  }
  module.exports = AppError;
  