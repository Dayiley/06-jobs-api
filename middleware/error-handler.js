const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, please try again",
  };

  //  Mongoose validation errors (required fields, enum, etc.)
  if (err.name === "ValidationError") {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  }

  //  Duplicate key error (email already exists)
  if (err.code && err.code === 11000) {
    customError.statusCode = StatusCodes.CONFLICT; // 409
    customError.msg = "Email already exists";
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
