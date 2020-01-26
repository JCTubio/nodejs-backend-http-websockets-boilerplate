import DemoService from "../DemoService";

import DemoModel from "../../database/models/DemoModel";
jest.mock("../../database/models/DemoModel");

describe("Demo Service Test", () => {
  const server = {};
  let demoService = null;

  beforeAll(async () => {
    server.emit = jest.fn();
    demoService = new DemoService(DemoModel, server);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Calls the demo value model to save a demo value when createWish is called", () => {
    const spy = jest.spyOn(DemoModel, "create");
    const data = { name: "juan" };

    demoService.createDemoValue(data);

    expect(spy).toHaveBeenCalledWith(data);
  });

  it("Calls the demo value model to update a demo value when updateWish is called", () => {
    const spy = jest.spyOn(DemoModel, "update");
    const data = { name: "cruz" };
    const query = { id: "1234" };

    demoService.updateDemoValue(query, data);

    expect(spy).toHaveBeenCalledWith(query, data);
  });

  it("Calls the demo value model to delete a demo value when deleteWish is called", () => {
    const spy = jest.spyOn(DemoModel, "delete");
    const query = { id: "1234" };

    demoService.deleteDemoValue(query);

    expect(spy).toHaveBeenCalledWith(query);
  });

  it("Calls the demo value model to get all demo values with the corresponding user id when getById is called", () => {
    const spy = jest.spyOn(DemoModel, "getById");
    const query = { id: "1234" };

    demoService.getDemoValuesByUserId(query);

    expect(spy).toHaveBeenCalledWith(query);
  });
});
