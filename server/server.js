import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import io from "socket.io";

import controllers from "../controllers";
import services from "../services";
import models from "../database/models";

import { CONNECTION, CONNECTION_SUCCESS } from "../eventTypes/connection";

export function getServer() {
  const expressServer = express();

  expressServer.use(
    cors(),
    bodyParser.urlencoded({ extended: true }),
    bodyParser.json()
  );

  return expressServer;
}

export function initializeServer(server, port) {
  const { DemoController } = controllers;
  const { DemoService } = services;
  const { DemoModel } = models;

  const defaultPort = port ? port : process.env.BACK_END_PORT || 8000;

  const httpServer = http.createServer(server);
  const activeHttpServer = httpServer.listen(defaultPort, () => {
    console.log("Server listening on port: ", defaultPort);
  });

  const websocketsServer = io(httpServer);
  websocketsServer.on(CONNECTION, client => {
    client.emit(CONNECTION_SUCCESS, { message: "Connected successfully." });
    new DemoController(client, DemoService, DemoModel);
  });

  function closeConnection() {
    websocketsServer.close();
    activeHttpServer.close();
  }

  return closeConnection;
}
