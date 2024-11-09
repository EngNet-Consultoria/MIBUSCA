/* eslint-disable import/first */
import dotenv from "dotenv-safe";
dotenv.config();
import "express-async-errors";

import app from "./server";
import { mysqlConn } from "./mysql";
import http from "http";

const server = http.createServer(app);

server.listen(process.env.PORT, async () => {
  console.log(`Server started on http://localhost:${process.env.PORT}`);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down server...");

  server.close(async () => {
    await mysqlConn.disconnect();
  });
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down server...");

  server.close(async () => {
    await mysqlConn.disconnect();
  });
});
