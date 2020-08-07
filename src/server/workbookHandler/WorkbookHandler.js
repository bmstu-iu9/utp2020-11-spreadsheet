import WorkbookModel from '../database/WorkbookModel.js';
import FormatError from '../../lib/errors/FormatError.js';
import ClassConverter from '../../lib/saveWorkbook/ClassConverter.js';
import JsonConverter from '../../lib/readWorkbook/JsonConverter.js';
import DataRepo from '../database/DataRepo.js';

export default class WorkbookHandler {
  constructor(database) {
    this.database = database;
    this.dataRepo = new DataRepo(this.database);
  }

  get(login) {
    if (typeof login === 'undefined') {
      throw new FormatError('getting workbooks without login');
    }
    try {
      const list = this.dataRepo.workbookRepo.getByLogin(login);
      const result = [];
      list.forEach((wbModel) => {
        const workbook = { id: wbModel.id };
        const reads = ClassConverter.convertToJson(JsonConverter.readWorkbook(wbModel.path));
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
    if (typeof login === 'undefined' || login === '') {
      throw new FormatError('creating workbook without login');
    } else if (typeof workbook === 'undefined') {
      throw new FormatError('creating workbook without workbook');
    } else if (typeof pathToWorkbooks === 'undefined') {
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
      const book = ClassConverter.convertToJson(JsonConverter.readWorkbook(workbookModel.path));
      const workbookID = { id: this.dataRepo.workbookRepo.save(workbookModel) };
      //  workbook.lastCommit = workbook.lastCommit;
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

  close() {
    this.database.close();
  }
}
