// Necessary to make inheritance possible
/* eslint-disable class-methods-use-this */
import DataRepo from '../database/DataRepo.js';

export default class EndpointHandler {
  constructor(dataRepo) {
    this.setDataRepo(dataRepo);
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
