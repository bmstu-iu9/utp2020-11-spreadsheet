// Necessary to make inheritance possible
/* eslint-disable class-methods-use-this */
import DataRepo from '../database/DataRepo.js';
import SaveSystem from '../save/SaveSystem.js';

export default class EndpointHandler {
  constructor(dataRepo, saveSystem) {
    this.setDataRepo(dataRepo);
    this.setSaveSystem(saveSystem);
  }

  setSaveSystem(saveSystem) {
    if (!(saveSystem instanceof SaveSystem)) {
      throw new TypeError('saveSystem must be a SaveSystem instance');
    }
    this.saveSystem = saveSystem;
  }

  setDataRepo(dataRepo) {
    if (!(dataRepo instanceof DataRepo)) {
      throw new TypeError('dataRepo argument must be a DataRepo instance');
    }
    this.dataRepo = dataRepo;
  }

  get(req, res) {
    res.sendStatus(405);
  }

  post(req, res) {
    res.sendStatus(405);
  }

  patch(req, res) {
    res.sendStatus(405);
  }

  delete(req, res) {
    res.sendStatus(405);
  }
}
