const bcrypt = require("bcryptjs");
const convert_timeStamp_without_timezoneToIndian = require("../utils/convert_timeStamp_without_timezoneToIndian");
const getTimeDifferenceInMinutes = require("../utils/getTimeDifferenceInMinutes");
const deleteOtpSession = require("../SQL/deleteOtpSession");
const verifyEnteredOtp = async (client, mobile_number, otp) => {
  try {
    const result = await client.query(
      "select *from spur_user_otp_session where mobile_number =$1",
      [mobile_number]
    );
    if (0 < result.rows.length) {
      let hotp = result.rows[0].hashed_otp;
      const isvalidotp = await bcrypt.compare(otp, hotp);
      if (!isvalidotp) {
        throw { status: false, err_message: "Invalid OTP!" };
      } else {
        //checkf or otp expiry
        let now = new Date();
        //convert timestamp w/o time zone to indain dateandtime
        let created_dateandtime = convert_timeStamp_without_timezoneToIndian(
          result.rows[0].updatedat
        );
        if (getTimeDifferenceInMinutes(now, created_dateandtime) >= 5) {
          //remove entry from db
          await deleteOtpSession(client, mobile_number);
          throw {
            status: false,
            err_message: "OTP is expired, please re-login!",
          };
        } else {
          await deleteOtpSession(client, mobile_number);
        }
      }
    } else {
      await deleteOtpSession(client, mobile_number);
      throw {
        status: false,
        err_message: "Mobile number not registered!",
      };
    }
    return {
      status: true,
      err_message: "",
    };
  } catch (err) {
    throw err;
  }
};
module.exports = verifyEnteredOtp;
