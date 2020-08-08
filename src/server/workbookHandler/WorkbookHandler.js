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

  get(request, response) {
    if (request.login === undefined || request.login === '') {
      throw new FormatError('getting workbooks without login');
    }
    try {
      const list = this.dataRepo.workbookRepo.getByLogin(request.login);
      const result = [];
      list.forEach((wbModel) => {
        const workbook = { id: wbModel.id };
        const reads = ClassConverter.readObject(JsonConverter.readWorkbook(wbModel.path));
        workbook.name = reads.name;
        workbook.sheets = reads.sheets;
        result.push(workbook);
      });
      response.response = 200;
      response.content = result;
      return response;
    } catch (error) {
      response.response = 401;
      return response;
    }
  }

  post(request, response) {
    if (request.login === undefined || request.login === '') {
      throw new FormatError('creating workbook without login');
    } else if (request.workbook === undefined) {
      throw new FormatError('creating workbook without workbook');
    } else if (request.pathToWorkbooks === undefined || request.pathToWorkbooks === '') {
      throw new FormatError('creating workbook without path');
    }
    try {
      this.dataRepo.tokenRepo.getByLogin(request.login);
    } catch (error) {
      response.response = 401;
      return response;
    }
    try {
      ClassConverter.saveJson(request.workbook, request.pathToWorkbooks);
      const workbookModel = new WorkbookModel(`${request.pathToWorkbooks}/${request.workbook.name}.json`, request.login);
      const book = ClassConverter.readObject(JsonConverter.readWorkbook(workbookModel.path));
      const workbookID = { id: this.dataRepo.workbookRepo.save(workbookModel) };
      workbookID.lastCommit = zeroID;
      workbookID.name = book.name;
      workbookID.sheets = book.sheets;
      response.response = 200;
      response.content = workbookID;
      return response;
    } catch (error) {
      response.response = 400;
      return response;
    }
  }

  delete(request, response) {
    if (request.login === undefined || request.login === '') {
      throw new FormatError('deleting workbooks without login');
    } else if (request.workbookID === undefined) {
      throw new FormatError('deleting workbooks without book id');
    }
    try {
      this.dataRepo.tokenRepo.getByLogin(request.login);
    } catch (error) {
      response.response = 401;
      return response;
    }
    let workbook;
    try {
      workbook = this.dataRepo.workbookRepo.getById(request.workbookID);
    } catch (error) {
      response.response = 404;
      return response;
    }
    if (request.login !== workbook.login) {
      response.response = 403;
      return response;
    }
    this.dataRepo.workbookRepo.delete(request.workbookID);
    fs.unlinkSync(workbook.path);
    response.response = 200;
    return response;
  }
}
