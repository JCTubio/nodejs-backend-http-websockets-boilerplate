import events from '../eventTypes';

const { 
  CREATE_DEMOVALUE,
  UPDATE_DEMOVALUE,
  DELETE_DEMOVALUE,
  GET_DEMOVALUES_BY_ID
} = events.demoEvents;

class DemoController {
  constructor(socket, Service, Model) {
    this.socket = socket;
    this.service = new Service(Model, socket);
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.socket.on(CREATE_DEMOVALUE, (valueData, cb) =>
      this.service.createDemoValue(valueData, cb)
    );
    this.socket.on(UPDATE_DEMOVALUE, (query, valueData, cb) =>
      this.service.updateDemoValue(query, valueData, cb)
    );
    this.socket.on(DELETE_DEMOVALUE, (query, cb) =>
      this.service.deleteDemoValue(query, cb)
    );
    this.socket.on(GET_DEMOVALUES_BY_ID, (query, cb) =>
      this.service.getDemoValuesByUserId(query, cb)
    );
  }
}

export default DemoController;
