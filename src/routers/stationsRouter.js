const express = require("express");
const stationsRouter = express.Router();
const checkUserAuthentication = require("../middleware/checkUserAuthentication");
stationsRouter.get(
  "/unreserved-ticket/user/stations",
  checkUserAuthentication,
  async (req, res) => {
    res.send("test");
  }
);
module.exports = stationsRouter;
