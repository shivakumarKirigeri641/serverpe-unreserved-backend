const express = require("express");
const sendOtpRouter = express.Router();
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
//api for send-otp
sendOtpRouter.post("/unreserved-ticket/user/send-otp", async (req, res) => {
  let client = null;
  try {
    let { mobile_number } = req?.body;
    console.log(mobile_number);
    //1. verify mobilenumber
    if (!verifyMobileNumber(mobile_number)) {
      sendFailedResponse(res, "Invalid mobile number!");
    }

    //2. generate otp
    const otp = getRandomOtp();

    //3. call sms api
    const result_of_sms = await sendOTPSMS(mobile_number, otp, 3);
    if (!result_of_sms.success) {
      sendFailedResponse(
        200,
        res,
        result_of_sms,
        "Failed in sending OtP. Try again later"
      );
    }
    //4. insert into otp_session
    const pool = await connectDB();
    client = await getPostgreClient(pool);
    if (!client) {
      sendFailedResponse(
        200,
        res,
        result_of_sms,
        "Failed in sending OtP. Try again later"
      );
    }
    await client.query("BEGIN");
    await insertOtpSessions(client, mobile_number, otp);
    await client.query("COMMIT");
    //5. sendresponse 'otp sent'
    sendSuccessResponse(
      200,
      res,
      "OTP sent successfully...",
      result_of_sms.data
    );
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

module.exports = sendOtpRouter;
