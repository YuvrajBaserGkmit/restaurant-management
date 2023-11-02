require("dotenv").config();
const express = require("express");

const app = express();

const startServer = async function () {
  try {
    const serverPort = process.env.SERVER_PORT || 5000;
    app.listen(serverPort);
    console.log(`--- Server started on ${serverPort} ---\n\n`);
  } catch (err) {
    console.log("server setup failed", err);
    console.log("Error: ", err.message);
  }
};

startServer();
