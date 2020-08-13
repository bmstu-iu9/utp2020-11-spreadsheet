import { Cell } from '../spreadsheets/Cell.js';
import Spreadsheet from '../spreadsheets/Spreadsheet.js';
import Workbook from '../spreadsheets/Workbook.js';

export default class WorkbookJsonDeserializer {
  static deserialize(serializedWorkbook) {
    return new Workbook(
      serializedWorkbook.name,
      this.deserializeSpreadsheets(serializedWorkbook.spreadsheets),
    );
  }

  static deserializeSpreadsheets(spreadsheets = []) {
    const resultSpreadsheets = [];
    spreadsheets.forEach((spreadsheet) => {
      resultSpreadsheets.push(
        new Spreadsheet(spreadsheet.name, this.deserializeCells(spreadsheet.cells)),
      );
    });
    return resultSpreadsheets;
  }

  static deserializeCells(cells = {}) {
    const resultCells = new Map();
    const keys = Object.keys(cells);
    keys.forEach((key) => {
      resultCells.set(key, new Cell(cells[key].type, cells[key].value, cells[key].color));
    });
    return resultCells;
  }
}
