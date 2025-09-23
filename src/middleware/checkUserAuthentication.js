const jwt = require("jsonwebtoken");
require("dotenv").config();
const checkUserAuthentication = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw {
        success: false,
        message: "No Session found!",
        data: {},
      };
    }
    const result = await jwt.verify(token, process.env.SECRET_KEY);
    console.log(result);
    //now fetch token from db and compare and equal , check for last active timestamp
    next();
  } catch (err) {
    throw err;
  }
};
module.exports = checkUserAuthentication;
