const express = require("express");
const getStationDetails = require("../SQL/getStationDetails");
const getTrains = require("../SQL/getTrains");
const trainListRouter = express.Router();
const checkUserAuthentication = require("../middleware/checkUserAuthentication");
const { connectDB } = require("../database/connectDB");
const getPostgreClient = require("../SQL/getPostgreClient");
trainListRouter.post(
  "/unreserved-ticket/user/trains-list",
  checkUserAuthentication,
  async (req, res) => {
    let client = null;
    try {
      const { src, dest } = req.body;
      console.log(req.body);
      if (!src) {
        throw {
          err_details: {
            success: false,
            message: "Invalid source provided!",
            data: {},
          },
        };
      }
      if (!dest) {
        throw {
          err_details: {
            success: false,
            message: "Invalid destination provided!",
            data: {},
          },
        };
      }
      const pool = await connectDB();
      client = await getPostgreClient(pool);
      const result_sourcedetails = await getStationDetails(
        client,
        src.toUpperCase()
      );
      const result_destinationdetails = await getStationDetails(
        client,
        dest.toUpperCase()
      );
      if (0 === result_sourcedetails.rows.length) {
        throw {
          err_details: {
            success: false,
            message: "Source station mentioned was not found!",
            data: {},
          },
        };
      }
      if (0 === result_destinationdetails.rows.length) {
        throw {
          err_details: {
            success: false,
            message: "Destination station mentioned was not found!",
            data: {},
          },
        };
      }
      const result = await getTrains(
        client,
        src.toUpperCase(),
        dest.toUpperCase()
      );
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
module.exports = trainListRouter;
