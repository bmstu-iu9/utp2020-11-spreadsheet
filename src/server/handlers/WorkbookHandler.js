import fs from 'fs';
import WorkbookModel from '../database/WorkbookModel.js';
import { zeroID } from '../synchronization/Synchronizer.js';
import EndpointHandler from './EndpointHandler.js';
import WorkbookLoader from '../save/WorkbookLoader.js';
import WorkbookSaver from '../save/WorkbookSaver.js';
import WorkbookJsonDeserializer from '../../lib/serialization/WorkbookDeserializer.js';
import WorkbookPathGenerator from '../save/WorkbookPathGenerator.js';

export default class WorkbookHandler extends EndpointHandler {
  get(req, res) {
    if (req.user === undefined) {
      return res.sendStatus(401);
    }
    let list;
    try {
      list = this.dataRepo.workbookRepo.getByLogin(req.user.login);
    } catch (error) {
      return res.sendStatus(404);
    }
    const result = [];
    list.forEach((wbModel) => {
      const workbook = { id: wbModel.id };
      const pathGenerator = new WorkbookPathGenerator(this.config.pathToWorkbooks);
      const loader = new WorkbookLoader(pathGenerator);
      const reads = loader.load(wbModel.id);
      workbook.name = reads.name;
      workbook.spreadsheets = reads.spreadsheets;
      result.push(workbook);
    });
    return res.status(200).send(result);
  }

  post(req, res) {
    if (req.user === undefined) {
      return res.sendStatus(401);
    }
    if (req.body === undefined) {
      return res.sendStatus(400);
    }
    const deserialized = WorkbookJsonDeserializer.deserialize(req.body);
    const workbookModel = new WorkbookModel(req.user.login);
    const workbookID = { id: this.dataRepo.workbookRepo.save(workbookModel) };
    const generator = new WorkbookPathGenerator('.');
    const saver = new WorkbookSaver(generator);
    saver.save(deserialized, workbookID.id);
    workbookID.lastCommit = zeroID;
    workbookID.name = req.body.name;
    workbookID.spreadsheets = req.body.spreadsheets;
    return res.status(200).send(workbookID);
  }
}
