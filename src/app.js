const express = require("express");
const { connectDB } = require("./database/connectDB");
const app = new express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("./routers/authRouter");
require("dotenv").config();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:1234",
    credentials: true,
  })
);

app.use("/", authRouter);
connectDB()
  .then(() => {
    console.log("Database connected successfully.");
    app.listen(process.env.OPTIONALPORT, () => {
      console.log("Server is listening now.");
    });
  })
  .catch((err) => {
    console.log("Error in connecting database: Error:" + err.message);
  });
