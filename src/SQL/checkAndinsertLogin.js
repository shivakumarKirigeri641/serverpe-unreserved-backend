const checkAndinsertLogin = async (client, mobile_number) => {
  let result = null;
  try {
    await client.query("BEGIN");
    result = await client.query(
      "select *from spur_users where mobile_number = $1",
      [mobile_number]
    );
    if (0 === result.rows.length) {
      result = await client.query(
        "insert into spur_users (mobile_number) values ($1) returning *",
        [mobile_number]
      );
    }
    await client.query(
      "insert into spur_users_logintracker (fk_spur_user) values ($1) returning *",
      [result.rows[0].id]
    );
    await client.query("COMMIT");
    return result;
  } catch (ERR) {
    await client.query("ROLLBACK");
    throw ERR;
  }
};

module.exports = checkAndinsertLogin;
