const express = require("express");
const jwt = require("jsonwebtoken");
const ticketHistoryRouter = express.Router();
const getPostgreClient = require("../SQL/getPostgreClient");
const { connectDB } = require("../database/connectDB");
const getTicketHistory = require("../SQL/getTicketHistory");
ticketHistoryRouter.get(
  "/unreserved-ticket/user/ticket-history",
  async (req, res) => {
    let client = null;
    try {
      const { token } = req.cookies;
      if (!token) {
        throw {
          success: false,
          message: "No Session found! Please re-login",
          data: {},
        };
      }
      const result = await jwt.verify(token, process.env.SECRET_KEY);
      const pool = await connectDB();
      client = await getPostgreClient(pool);
      const result_history = await getTicketHistory(
        client,
        result.mobile_number
      );
      res.status(200).json({
        success: true,
        message: "Ticket history fetched successfully.",
        data: result_history.rows,
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

module.exports = ticketHistoryRouter;
