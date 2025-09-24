const express = require("express");
const getAllStations = require("../SQL/getAllStations");
const stationsRouter = express.Router();
const checkUserAuthentication = require("../middleware/checkUserAuthentication");
const { connectDB } = require("../database/connectDB");
const getPostgreClient = require("../SQL/getPostgreClient");
stationsRouter.get(
  "/unreserved-ticket/user/stations",
  checkUserAuthentication,
  async (req, res) => {
    let client = null;
    try {
      const pool = await connectDB();
      client = await getPostgreClient(pool);
      const result = await getAllStations(client);
      res.status(200).json({
        success: true,
        message: "stations fetched successfully",
        data: result.rows,
      });
    } catch (err) {
      if (client) {
        await client.query("ROLLBACK");
      }
      res.status(400).json(err);
    } finally {
      if (client) {
        await client.release();
      }
    }
  }
);
module.exports = stationsRouter;
