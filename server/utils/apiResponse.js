import { StatusCodes } from "http-status-codes";

export const successResponse = (
  res,
  statuscode = null,
  data = "Success",
  statusCode = StatusCodes.OK,
) => {
  return res.status(statusCode).json({
    success: true,
    data,
    statuscode,
  });
};

export const errorResponse = (
  res,
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
  message = "Something went wrong",
  error = null,
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};
