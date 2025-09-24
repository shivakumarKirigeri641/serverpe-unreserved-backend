const express = require("express");
const getStationDetails = require("../SQL/getStationDetails");
const getTrains = require("../SQL/getTrains");
const bookTicketRouter = express.Router();
const checkUserAuthentication = require("../middleware/checkUserAuthentication");
const { connectDB } = require("../database/connectDB");
const getPostgreClient = require("../SQL/getPostgreClient");
const insertSearchDetails = require("../SQL/insertSearchDetails");
const validateBookingData = require("../utils/validateBookingData");
const insertJourneyData = require("../SQL/insertJourneyData");
bookTicketRouter.post(
  "/unreserved-ticket/user/book-ticket",
  checkUserAuthentication,
  async (req, res) => {
    let client = null;
    /**
     body will be like this:
     train_number:12345,
     src:'ypr',
     dest:'ubl',
     adults:1,
     children:0,
     physicallyhandicaped:false,
     total_fare:333,
     paytype:0
     <dateof journey> you need to get arrival time of train on selected source and that will be date & tiem of journey, 
    */
    try {
      const {
        train_number,
        src,
        dest,
        adults,
        chidren,
        physicallyhandicaped,
        total_fare,
        paytype,
      } = req.body;
      const pool = await connectDB();
      client = await getPostgreClient(pool);
      //1. validate the body
      await validateBookingData(client, req.body);

      //book ticket & get ticket info
      const bookeddata = await insertJourneyData(client, req);

      res.status(200).json({
        success: true,
        message: "Ticket booked successfully.",
        data: bookeddata,
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
module.exports = bookTicketRouter;
