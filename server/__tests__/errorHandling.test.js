import mongoose from "mongoose";
import io from "socket.io-client";
import getPort from "get-port";

import { getServer, initializeServer } from "../server";

import DemoModel from "../../database/models/DemoModel";
jest.mock("../../database/models/DemoModel");

import events from '../../eventTypes';
import { fail } from "assert";

const {
  CONNECTION, 
  CONNECTION_SUCCESS
} = events.connectionEvents

const {
  CREATE_DEMOVALUE,
  CREATE_DEMOVALUE_SUCCESS,
  CREATE_DEMOVALUE_ERROR,
  UPDATE_DEMOVALUE,
  UPDATE_DEMOVALUE_SUCCESS,
  UPDATE_DEMOVALUE_ERROR,
  DELETE_DEMOVALUE,
  DELETE_DEMOVALUE_SUCCESS,
  DELETE_DEMOVALUE_ERROR,
  GET_DEMOVALUES_BY_ID,
  GET_DEMOVALUES_BY_ID_SUCCESS,
  GET_DEMOVALUES_BY_ID_ERROR
} = events.demoEvents

describe("basic socket.io example", () => {
  const originalError = console.error;
  let ioClient;
  let closeConnection = null;
  let port;
  /**
   * Setup WS & HTTP servers
   */
  beforeAll(async done => {
    DemoModel.create = jest.fn().mockRejectedValue(new Error("Mongoose error"));
    DemoModel.update = jest.fn().mockRejectedValue(new Error("Mongoose error"));
    DemoModel.delete = jest.fn().mockRejectedValue(new Error("Mongoose error"));
    DemoModel.getById = jest
      .fn()
      .mockRejectedValue(new Error("Mongoose error"));
    // const models = { DemoModel };
    await mongoose.connect(
      global.__MONGO_URI__,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
      },
      err => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
      }
    );
    port = await getPort();
    const server = getServer();
    closeConnection = initializeServer(server, port);
    done();
  });

  /**
   *  Cleanup WS & HTTP servers
   */

  async function removeAllCollections() {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName];
      await collection.deleteMany();
    }
  }

  afterAll(async done => {
    closeConnection();
    done();
  });

  /**
   * Run before each test
   */
  beforeEach(async done => {
    // Setup
    const socket = io(`http://localhost:${port}`);
    ioClient = socket.connect({
      "reconnection delay": 0,
      "reopen delay": 0,
      "force new connection": true,
      transports: ["websocket"]
    });
    console.error = jest.fn();
    done();
  });

  /**
   * Run after each test
   */
  afterEach(async done => {
    // Cleanup
    if (ioClient.connected) {
      ioClient.disconnect();
    }
    await removeAllCollections();
    console.error = originalError;
    done();
  });

  it("Should respond to a connection attempt and reply with a connection successfull message", done => {
    ioClient.on(CONNECTION_SUCCESS, message => {
      done();
    });
    ioClient.emit(CONNECTION);
  });

  it("Should respond with error because dao failed to validate upon receiving a createDemoValue event", done => {
    // assemble
    const demoValueData = {
      demoValue1: "abcd123",
      demoValue2: 5,
      demoValue3: "juancruztubio@gmail.com"
    };

    // assert
    ioClient.on(CREATE_DEMOVALUE_SUCCESS, () => {
      fail(
        "Resolved successfully, should have rejected with an error ",
        CREATE_DEMOVALUE_SUCCESS
      );
    });

    ioClient.on(CREATE_DEMOVALUE_ERROR, () => {
      done();
    });

    // act
    ioClient.emit(CREATE_DEMOVALUE, demoValueData);
  });

  it("Should respond with error because dao failed to validate upon receiving a updateDemoValue event", done => {
    // assemble
    const demoValueData = {
      demoValue1: "abcd123",
      demoValue2: 5,
      demoValue3: "juancruztubio@gmail.com"
    };

    const demoValueQuery = {
      demoValue1: "abcde1234"
    };

    // assert
    ioClient.on(UPDATE_DEMOVALUE_SUCCESS, () => {
      fail(
        "Resolved successfully, should have rejected with an error ",
        UPDATE_DEMOVALUE_SUCCESS
      );
    });

    ioClient.on(UPDATE_DEMOVALUE_ERROR, () => {
      done();
    });

    // act
    ioClient.emit(UPDATE_DEMOVALUE, demoValueQuery, demoValueData);
  });

  it("Should respond with error because dao failed to validate upon receiving a deleteDemoValue event", done => {
    // assemble
    const demoValueQuery = {
      demoValue1: "abcd123"
    };

    // assert
    ioClient.on(DELETE_DEMOVALUE_SUCCESS, () => {
      fail(
        "Resolved successfully, should have rejected with an error ",
        DELETE_DEMOVALUE_SUCCESS
      );
    });

    ioClient.on(DELETE_DEMOVALUE_ERROR, () => {
      done();
    });

    // act
    ioClient.emit(DELETE_DEMOVALUE, demoValueQuery);
  });

  it("Should respond with error because dao failed to validate upon receiving a getDemoValueById event", done => {
    // assemble
    const demoValueQuery = "abcd123";

    // assert
    ioClient.on(GET_DEMOVALUES_BY_ID_SUCCESS, () => {
      fail(
        "Resolved successfully, should have rejected with an error ",
        GET_DEMOVALUES_BY_ID_SUCCESS
      );
    });

    ioClient.on(GET_DEMOVALUES_BY_ID_ERROR, () => {
      done();
    });

    // act
    ioClient.emit(GET_DEMOVALUES_BY_ID, demoValueQuery);
  });

});
