const getPostgreClient = async (pool) => {
  let client = null;
  try {
    client = await pool.connect();
  } catch (err) {
    console.log("err:", err.message);
  }
  return client;
};
module.exports = getPostgreClient;
