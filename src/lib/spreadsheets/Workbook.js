import Spreadsheet from './Spreadsheet.js';

export default class Workbook {
  constructor(name, spreadsheets = []) {
    this.setName(name);
    this.setSpreadsheets(spreadsheets);
  }

  setName(name) {
    if (typeof name !== 'string') {
      throw new Error('Workbook name must be a string');
    }
    this.name = name;
  }

  createSpreadsheet(name) {
    this.spreadsheets.push(new Spreadsheet(name));
  }

  setSpreadsheets(spreadsheets) {
    if (!(spreadsheets instanceof Array)) {
      throw new Error('Spreadsheets must be an array');
    }
    spreadsheets.forEach((value) => {
      if (!(value instanceof Spreadsheet)) {
        throw new Error('Spreadsheets array elements must be spreadsheets');
      }
    });
    this.spreadsheets = spreadsheets;
  }
}
