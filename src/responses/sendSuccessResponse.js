const sendSuccessResponse = async (
  statusCode = 200,
  res,
  message = "",
  data = {}
) => {
  res.status(statusCode).json({ statusCode, success: true, message, data });
};
module.exports = sendSuccessResponse;
