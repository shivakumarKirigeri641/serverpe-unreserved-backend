const bcrypt = require("bcryptjs");
const convert_timeStamp_without_timezoneToIndian = require("../utils/convert_timeStamp_without_timezoneToIndian");
const getTimeDifferenceInMinutes = require("../utils/getTimeDifferenceInMinutes");
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
        now = new Date(now).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        });
        //convert timestamp w/o time zone to indain dateandtime
        let created_dateandtime = convert_timeStamp_without_timezoneToIndian(
          result.rows[0].createdat
        );
        if (getTimeDifferenceInMinutes(now, created_dateandtime) >= 5) {
          //remove entry from db
          throw {
            status: false,
            err_message: "OTP is expired, please re-login!",
          };
        }
      }
    } else {
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
  } finally {
    //delete the temporary otp session-entry
    await client.query("BEGIN");
    await client.query(
      "delete from spur_user_otp_session where mobile_number=$1",
      [mobile_number]
    );
    await client.query("COMMIT");
  }
};
module.exports = verifyEnteredOtp;
