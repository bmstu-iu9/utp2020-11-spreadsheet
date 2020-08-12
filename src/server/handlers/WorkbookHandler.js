import fs from 'fs';
import WorkbookModel from '../database/WorkbookModel.js';
import ClassConverter from '../../lib/saveWorkbook/ClassConverter.js';
import JsonConverter from '../../lib/readWorkbook/JsonConverter.js';
import { zeroID } from '../synchronization/Synchronizer.js';
import EndpointHandler from './EndpointHandler.js';

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
      const reads = ClassConverter.readObject(JsonConverter.readWorkbook(wbModel.path));
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
    ClassConverter.saveJson(req.body, req.params.pathToWorkbooks);
    const workbookModel = new WorkbookModel(`${req.params.pathToWorkbooks}/${req.body.name}.json`, req.user.login);
    const workbookID = { id: this.dataRepo.workbookRepo.save(workbookModel) };
    workbookID.lastCommit = zeroID;
    workbookID.name = req.body.name;
    workbookID.spreadsheets = req.body.spreadsheets;
    return res.status(200).send(workbookID);
  }

  delete(req, res) {
    if (req.user === undefined) {
      return res.sendStatus(401);
    }
    let workbook;
    try {
      workbook = this.dataRepo.workbookRepo.getById(req.params.workbookID);
    } catch (error) {
      return res.sendStatus(404);
    }
    if (req.user.login !== workbook.login) {
      return res.sendStatus(403);
    }
    this.dataRepo.workbookRepo.delete(req.params.workbookID);
    fs.unlinkSync(workbook.path);
    return res.sendStatus(200);
  }
}
