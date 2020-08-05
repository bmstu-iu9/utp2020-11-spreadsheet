import WorkbookRepo from '../../server/database/WorkbookRepo.js';
import JsonConverter from '../readWorkbook/JsonConverter.js';
import WorkbookModel from '../../server/database/WorkbookModel.js';
import ClassConverter from '../saveWorkbook/ClassConverter.js';
import fs from 'fs';

export default class WorkbookHandler {
  constructor(database) {
    this.database = database;
  }

  get(login) {
    const workbookRepo = new WorkbookRepo(this.database);
    try {
      const list = workbookRepo.getByLogin(login);
      const result = [];
      list.forEach((wbModel) => {
        const workbook = { id: wbModel.id };
        workbook.push(JSON.parse(fs.readFileSync(wbModel.path)));
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
}
