const jwt = require("jsonwebtoken");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const createJwtToken = async (mobile_number) => {
  try {
    const iuud = uuidv4();
    const combined = iuud + mobile_number;
    const token = await jwt.sign({ combined }, process.env.SECRET_KEY);
    return token;
  } catch (err) {
    throw err;
  }
};
module.exports = createJwtToken;
