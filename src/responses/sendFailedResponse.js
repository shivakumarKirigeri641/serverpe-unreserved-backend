const sendFailedResponse = async (
  statusCode = 401,
  res,
  responsedata = {},
  message = ""
) => {
  res
    .status(statusCode)
    .json({ statusCode, success: false, message, responsedata });
};
module.exports = sendFailedResponse;
