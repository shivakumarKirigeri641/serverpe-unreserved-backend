const axios = require("axios");
require("dotenv").config();
const sendOTPSMS = async (mobile_number, generatedotp, validfor) => {
  const fast2smsResp = await axios.get(
    `https://www.fast2sms.com/dev/bulkV2?authorization=${process.env.FAST2SMS_API_KEY}&route=dlt&sender_id=NOQTRN&message=198302&variables_values=${generatedotp}|${validfor}&numbers=${mobile_number}`
  );
  if (fast2smsResp.data && fast2smsResp.data.return) {
    //dont do anything
    return { success: true, data: fast2smsResp.data };
  } else {
    // bubble details for debugging
    return { success: false, data: fast2smsResp.data };
  }
};
module.exports = sendOTPSMS;
