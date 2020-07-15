import Spreadsheet from './Spreadsheet.js';
import Calculator from '../calculator/Calculator.js';
import { valueTypes } from './Cell.js';

export default class Workbook {
  constructor(name, spreadsheets = []) {
    this.setName(name);
    this.setSpreadsheets(spreadsheets);
    this.calculator = new Calculator(this);
  }

  setName(name) {
    if (Workbook.isNameCorrect(name)) {
      this.name = name;
    } else {
      throw new Error('Illegal name');
    }
  }

  static isNameCorrect(name) {
    return (typeof name === 'string') && (name.trim().length > 0);
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

  getProcessedValue(cell, page = 0) {
    if (this.spreadsheets[page].getCell(cell).type === valueTypes.formula) {
      return this.calculator.calculate(cell, page).value;
    }
    return this.spreadsheets[page].getCell(cell).value;
  }
}
