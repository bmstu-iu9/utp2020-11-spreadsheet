import fs from 'fs';
import WorkbookModel from '../database/WorkbookModel.js';
import FormatError from '../../lib/errors/FormatError.js';
import ClassConverter from '../../lib/saveWorkbook/ClassConverter.js';
import JsonConverter from '../../lib/readWorkbook/JsonConverter.js';
import { zeroID } from '../synchronization/synchronizer.js';

export default class WorkbookHandler {
  constructor(dataRepo) {
    this.dataRepo = dataRepo;
  }

  get(req, res) {
    if (req.user === undefined) {
      res.sendStatus(401);
    }
    try {
      const list = this.dataRepo.workbookRepo.getByLogin(req.user.login);
      const result = [];
      list.forEach((wbModel) => {
        const workbook = { id: wbModel.id };
        const reads = ClassConverter.readObject(JsonConverter.readWorkbook(wbModel.path));
        workbook.name = reads.name;
        workbook.sheets = reads.sheets;
        result.push(workbook);
      });
      res.status(200).send(result);
    } catch (error) {
      res.sendStatus(401);
    }
  }

  post(req, res) {
    if (req.user === undefined) {
      res.sendStatus(401);
    } else if (req.body === undefined || req.params === undefined) {
      res.sendStatus(400);
    }
    try {
      ClassConverter.saveJson(req.body, req.params.pathToWorkbooks);
      const workbookModel = new WorkbookModel(`${req.params.pathToWorkbooks}/${req.body.name}.json`, req.user.login);
      const book = ClassConverter.readObject(JsonConverter.readWorkbook(workbookModel.path));
      const workbookID = { id: this.dataRepo.workbookRepo.save(workbookModel) };
      workbookID.lastCommit = zeroID;
      workbookID.name = book.name;
      workbookID.sheets = book.sheets;
      res.status(200).send(workbookID);
    } catch (error) {
      res.sendStatus(400);
    }
  }

  delete(req, res) {
    if (req.user === undefined) {
      res.sendStatus(401);
    }
    if (req.params === undefined || req.params.workbookID === '') {
      res.sendStatus(404);
    }
    let workbook;
    try {
      workbook = this.dataRepo.workbookRepo.getById(req.params.workbookID);
    } catch (error) {
      res.sendStatus(404);
    }
    if (req.user.login !== workbook.login) {
      res.sendStatus(403);
    }
    this.dataRepo.workbookRepo.delete(req.params.workbookID);
    fs.unlinkSync(workbook.path);
    res.sendStatus(200);
  }
}
