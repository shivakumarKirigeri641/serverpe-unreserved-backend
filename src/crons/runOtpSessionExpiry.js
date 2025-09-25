const cron = require("node-cron");
const { connectDB } = require("../database/connectDB");
const getPostgreClient = require("../SQL/getPostgreClient");
cron.schedule("*/5 * * * *", async () => {
  let client = null;
  try {
    console.log("Checking for expired otp sesssions...");
    const pool = await connectDB();
    client = await getPostgreClient(pool);
    client.query("BEGIN");
    await checkAndRemoveExpiredOtpSessions(client);
    client.query("COMMIT");
  } catch (err) {
    client.query("ROLLBACK");
  } finally {
    client.release();
  }
});
const checkAndRemoveExpiredOtpSessions = async (client) => {
  try {
    const result_list_of_otpsessions = await client.query(
      `select *from spur_user_otp_session where createdat < NOW() - INTERVAL '5 minutes'`
    );
    for (let i = 0; i < result_list_of_otpsessions.rows.length; i++) {
      console.log(
        "Removing expired session:",
        result_list_of_otpsessions.rows[i].id
      );
      await client.query(`delete from spur_user_otp_session where id= $1`, [
        result_list_of_otpsessions.rows[i].id,
      ]);
    }
  } catch (err) {
    console.log(err.message);
  }
};
