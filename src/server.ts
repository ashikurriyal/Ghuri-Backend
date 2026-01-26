/* eslint-disable no-console */
import http = require("http");
import mongoose = require("mongoose");
import app = require("./app");

let server: http.Server;

const startServer = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://riyalashikur:KmTXd0pC0zSDkSat@cluster0.yimv6lc.mongodb.net/ghuri-tour-management-backend",
    );

    console.log("Connected to DB!!");

    server = app.listen(5001, () => {
      console.log("Server is listening to port 5001");
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
