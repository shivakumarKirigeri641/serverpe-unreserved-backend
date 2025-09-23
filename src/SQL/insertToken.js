const insertToken = async (client, mobile_number, token) => {
  try {
    console.log(mobile_number, token);
    await client.query("BEGIN");
    await client.query(
      "insert into spur_users_token_sessions (mobile_number, generated_token) values ($1,$2)",
      [mobile_number, token]
    );
    await client.query("COMMIT");
  } catch (ERR) {
    await client.query("ROLLBACK");
    throw ERR;
  }
};

module.exports = insertToken;
