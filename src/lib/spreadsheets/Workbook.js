import Spreadsheet from './Spreadsheet.js';
import Calculator from '../calculator/Calculator.js';
import { valueTypes } from './Cell.js';
import FormatError from '../errors/FormatError.js';
import TreeRunner from '../calculator/TreeRunner.js';

export default class Workbook {
  constructor(name, spreadsheets = []) {
    this.setName(name);
    this.setSpreadsheets(spreadsheets);
  }

  setName(name) {
    if (Workbook.isNameCorrect(name)) {
      this.name = name;
    } else {
      throw new FormatError('Illegal name');
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
      throw new TypeError('Spreadsheets must be an array');
    }
    spreadsheets.forEach((value) => {
      if (!(value instanceof Spreadsheet)) {
        throw new TypeError('Spreadsheets array elements must be spreadsheets');
      }
    });
    this.spreadsheets = spreadsheets;
  }

  getProcessedValue(position, page = 0) {
    const cell = this.spreadsheets[page].getCell(position);
    if (cell.type !== valueTypes.formula) {
      return new TreeRunner(null, null, [cell.type, cell.value]).run();
    }
    if (cell.needCalc === null) {
      throw new FormatError(`Сyclical calculations (in position ${position})`);
    }
    if (cell.needCalc) {
      cell.needCalc = null;
      cell.ansCalc = new Calculator(this).calculate(position, page);
      cell.needCalc = false;
    }
    return cell.ansCalc;
  }
}
