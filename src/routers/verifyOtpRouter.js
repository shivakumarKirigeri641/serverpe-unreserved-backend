const express = require("express");
const verifyOtpRouter = express.Router();
const {
  verifyMobileNumber,
  getPostgreClient,
  getRandomOtp,
  sendFailedResponse,
  connectDB,
  sendSuccessResponse,
  sendOTPSMS,
  insertOtpSessions,
} = require("../utils/dependencies");
verifyOtpRouter.post("/unreserved-ticket/user/verify-otp", async (req, res) => {
  let client = null;
  try {
    //1. verify mobile_number and otp
    //2. check if otp is valid from query
    //3. check if otp delay more then 3min
    //4. if all good, delete otp session
    //4. create jwt token and attach to response
    //5. insert into token sessions
    //5. success msg
    const pool = await connectDB();
    client = await getPostgreClient(pool);
  } catch (err) {
    if (client) {
      await client.query("ROLLBACK");
    }
    sendFailedResponse(502, res, err, "Failed in sending-otp");
  } finally {
    if (client) {
      await client.release();
    }
  }
});
module.exports = verifyOtpRouter;
