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

  get(login) {
    if (login === undefined) {
      throw new FormatError('getting workbooks without login');
    }
    try {
      const list = this.dataRepo.workbookRepo.getByLogin(login);
      const result = [];
      list.forEach((wbModel) => {
        const workbook = { id: wbModel.id };
        const reads = ClassConverter.readObject(JsonConverter.readWorkbook(wbModel.path));
        workbook.name = reads.name;
        workbook.sheets = reads.sheets;
        result.push(workbook);
      });
      return {
        response: 200,
        content: result,
      };
    } catch (error) {
      return { response: 401 };
    }
  }

  post(login, workbook, pathToWorkbooks) {
    if (login === undefined || login === '') {
      throw new FormatError('creating workbook without login');
    } else if (workbook === undefined) {
      throw new FormatError('creating workbook without workbook');
    } else if (pathToWorkbooks === undefined || pathToWorkbooks === '') {
      throw new FormatError('creating workbook without path');
    }
    try {
      this.dataRepo.tokenRepo.getByLogin(login);
    } catch (error) {
      return { response: 401 };
    }
    try {
      ClassConverter.saveJson(workbook, pathToWorkbooks);
      const workbookModel = new WorkbookModel(`${pathToWorkbooks}/${workbook.name}.json`, login);
      const book = ClassConverter.readObject(JsonConverter.readWorkbook(workbookModel.path));
      const workbookID = { id: this.dataRepo.workbookRepo.save(workbookModel) };
      workbookID.lastCommit = zeroID;
      workbookID.name = book.name;
      workbookID.sheets = book.sheets;
      return {
        response: 200,
        content: workbookID,
      };
    } catch (error) {
      return { response: 400 };
    }
  }

  delete(login, workbookID) {
    if (login === undefined) {
      throw new FormatError('deleting workbooks without login');
    } else if (workbookID === undefined) {
      throw new FormatError('deleting workbooks without book id');
    }
    try {
      this.dataRepo.tokenRepo.getByLogin(login);
    } catch (error) {
      return { response: 401 };
    }
    let workbook;
    try {
      workbook = this.dataRepo.workbookRepo.getById(workbookID);
    } catch (error) {
      return { response: 404 };
    }
    if (login !== workbook.login) {
      return { response: 403 };
    }
    this.dataRepo.workbookRepo.delete(workbookID);
    fs.unlinkSync(workbook.path);
    return { response: 200 };
  }
}
