const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);
  
  const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
// const message1=err.errors[0].validatorArgs[0].message
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
  };
  const uniqueValidation = err => {
    const errors = Object.values(err.errors).map(el => el.message);
// const message1=err.errors[0].validatorArgs[0].message
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
  };

const AppError = require("../Utils/AppError");
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).send({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  };

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    let error = { ...err };
    error.message = err.message;
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    if (error.name === 'SequelizeValidationError')
    error = handleValidationErrorDB(error);
    if(error.name==="SequelizeUniqueConstraintError") error= uniqueValidation(error)
      sendErrorDev(error, res);
      
  };