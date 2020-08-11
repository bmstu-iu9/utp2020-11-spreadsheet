import fs from 'fs';
import { Cell } from '../spreadsheets/Cell.js';
import Spreadsheet from '../spreadsheets/Spreadsheet.js';
import Workbook from '../spreadsheets/Workbook.js';

export default class JsonConverter {
  static readWorkbook(pathToWorkbook) {
    const file = JSON.parse(fs.readFileSync(pathToWorkbook));
    const workbook = new Workbook(file.name, this.readSpreadsheets(file.spreadsheets));
    return workbook;
  }

  static readSpreadsheets(spreadsheets = []) {
    const resultSpreadsheets = [];
    spreadsheets.forEach((spreadsheet) => {
      resultSpreadsheets.push(new Spreadsheet(spreadsheet.name, this.readCells(spreadsheet.cells)));
    });
    return resultSpreadsheets;
  }

  static readCells(cells = {}) {
    const resultCells = new Map();
    const keys = Object.keys(cells);
    keys.forEach((key) => {
      resultCells.set(key, new Cell(cells[key].type, cells[key].value, cells[key].color));
    });
    return resultCells;
  }
}
