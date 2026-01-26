import Server = require("http");
import mongoose = require("mongoose");
import app = require("./app");

let server;

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
