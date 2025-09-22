const express = require("express");
const verifyOtpRouter = express.Router();
verifyOtpRouter.post("/unreserved-ticket/user/verify-otp", async (req, res) => {
  res.send("test");
});
module.exports = verifyOtpRouter;
