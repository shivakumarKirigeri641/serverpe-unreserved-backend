const express = require("express");
const verifyMobileNumber = require("../utils/verifyMobileNumber");
const getPostgreClient = require("../utils/getPostgreClient");
const getRandomOtp = require("../utils/getRandomOtp");
const sendOTPSMS = require("../utils/sendOTPSMS");
const sendOtpRouter = express.Router();
require("dotenv").config();
const sendFailedResponse = require("../responses/sendFailedResponse");
const sendSuccessResponse = require("../responses/sendSuccessResponse");
const insertOtpSessions = require("../SQL/insertOtpSessions");
const { connectDB } = require("../database/connectDB");
module.exports = {
  express,
  verifyMobileNumber,
  connectDB,
  getPostgreClient,
  getRandomOtp,
  sendOtpRouter,
  sendFailedResponse,
  sendSuccessResponse,
  insertOtpSessions,
  sendOTPSMS,
};
