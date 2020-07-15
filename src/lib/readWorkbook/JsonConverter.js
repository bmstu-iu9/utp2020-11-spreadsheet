import fs from 'fs';
import schema from 'jsonschema';
import { Cell } from '../spreadsheets/Cell.js';
import Spreadsheet from '../spreadsheets/Spreadsheet.js';
import Workbook from '../spreadsheets/Workbook.js';

const workbookSchema = JSON.parse(fs.readFileSync('./resources/tableSchema.json'));

export default class JsonConverter {
  static readCells(cells) {
    const resultCells = new Map();
    const keys = Object.keys(cells);
    keys.forEach((key) => {
      resultCells.set(key, new Cell(cells[key].type, cells[key].value, cells[key].color));
    });
    return resultCells;
  }

  static readSpreadsheets(spreadsheets) {
    const resultSpreadsheets = [];
    spreadsheets.forEach((spreadsheet) => {
      resultSpreadsheets.push(new Spreadsheet(spreadsheet.name, this.readCells(spreadsheet.cells)));
    });
    return resultSpreadsheets;
  }

  static readWorkbook(pathToWorkbook) {
    const file = JSON.parse(fs.readFileSync(pathToWorkbook));
    if (schema.validate(file, workbookSchema).valid === false) {
      throw new Error('Invalid workbook');
    }
    const workbook = new Workbook(file.name, this.readSpreadsheets(file.sheets));
    return workbook;
  }
}
