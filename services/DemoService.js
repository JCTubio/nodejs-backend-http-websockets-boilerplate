import events from '../eventTypes';

const { 
  CREATE_DEMOVALUE_SUCCESS,
  CREATE_DEMOVALUE_ERROR,
  UPDATE_DEMOVALUE_SUCCESS,
  UPDATE_DEMOVALUE_ERROR,
  DELETE_DEMOVALUE_SUCCESS,
  DELETE_DEMOVALUE_ERROR,
  GET_DEMOVALUES_BY_ID_SUCCESS,
  GET_DEMOVALUES_BY_ID_ERROR
} = events.demoEvents;

export default class DemoService {
  constructor(model, server) {
    this.model = model;
    this.server = server;
  }

  async createDemoValue(valueData, cb) {
    try {
      await this.model.create(valueData);
      this.server.emit(CREATE_DEMOVALUE_SUCCESS);
    } catch (error) {
      console.error(error);
      this.server.emit(CREATE_DEMOVALUE_ERROR);
    }
  }

  async updateDemoValue(query, valueData) {
    try {
      await this.model.update(query, valueData);
      this.server.emit(UPDATE_DEMOVALUE_SUCCESS);
    } catch (error) {
      console.error(error);
      this.server.emit(UPDATE_DEMOVALUE_ERROR);
    }
  }

  async deleteDemoValue(query) {
    try {
      await this.model.delete(query);
      this.server.emit(DELETE_DEMOVALUE_SUCCESS);
    } catch (error) {
      console.error(error);
      this.server.emit(DELETE_DEMOVALUE_ERROR);
    }
  }

  async getDemoValuesByUserId(query) {
    try {
      await this.model.getById(query);
      this.server.emit(GET_DEMOVALUES_BY_ID_SUCCESS);
    } catch (error) {
      console.error(error);
      this.server.emit(GET_DEMOVALUES_BY_ID_ERROR);
    }
  }
}
