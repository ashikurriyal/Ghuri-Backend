/* eslint-disable no-console */
import http = require("http");
import mongoose = require("mongoose");
import app = require("./app");
import envVars = require("./app/config/env");

let server: http.Server;

const startServer = async () => {
  try {
    // console.log(envVars.NODE_ENV)
    await mongoose.connect(
      "mongodb+srv://riyalashikur:KmTXd0pC0zSDkSat@cluster0.yimv6lc.mongodb.net/ghuri-tour-management-backend",
    );

    console.log("Connected to DB!!");

    server = app.listen(envVars.PORT, () => {
      console.log(`Server is listening to port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

// Unhandled rejection error
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection Detected... Server shutting down..", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
//unhandled rejection error
// Promise.reject(new Error("I Forgot to catch this promis"));

//Uncaught rejection error
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception Detected... Server shutting down..", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
//uncaught exception error
// throw new Error("I forgot to handle this local error")

//Signal termination - sigTerm
process.on("SIGTERM", (err) => {
  console.log("SIGTERM signal received... Server shutting down..", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
