import { Cell, valueTypes } from './Cell.js';
import Parser from '../parser/Parser.js';
import FormatError from '../errors/FormatError.js';

export default class Spreadsheet {
  constructor(name, cells = new Map()) {
    this.setName(name);
    this.setCells(cells);
  }

  setName(name) {
    if (Spreadsheet.isNameCorrect(name)) {
      this.name = name;
    } else {
      throw new FormatError('Illegal name');
    }
  }

  static isNameCorrect(name) {
    return (typeof name === 'string') && (name.trim().length > 0);
  }

  setCells(cells) {
    this.treeIn = new Map();
    this.treeOut = new Map();
    if (cells instanceof Map) {
      cells.forEach((cell, position) => {
        if (!Spreadsheet.isPositionCorrect(position)) {
          throw new FormatError('Illegal position');
        }
        if (!(cell instanceof Cell)) {
          throw new TypeError('Map values must be cells');
        }
      });
      cells.forEach((cell, position) => {
        this.treeIn.set(position, new Set());
        this.treeOut.set(position, new Set());
      });
      this.cells = cells;
    } else {
      throw new TypeError('Cells must be a Map');
    }
  }

  getCell(position) {
    if (Spreadsheet.isPositionCorrect(position)) {
      if (!this.cells.has(position)) {
        this.cells.set(position, new Cell());
        this.treeIn.set(position, new Set());
        this.treeOut.set(position, new Set());
      }
      return this.cells.get(position);
    }
    throw new FormatError('Illegal position');
  }

  static isPositionCorrect(position) {
    const positionRegExp = new RegExp('^[A-Z]+[1-9][0-9]*$');
    return positionRegExp.test(position);
  }

  static isColumnCorrect(column) {
    const columnRegExp = new RegExp('^[A-Z]+$');
    return columnRegExp.test(column);
  }

  setValueInCell(position, type, value) {
    this.getCell(position).setValue(type, value);
    this.treeOut.get(position).forEach((element) => {
      this.treeIn.get(element).delete(position);
    });
    const parser = (type === valueTypes.formula ? new Parser(value).run() : []);
    const ans = new Set();
    this.treeOut.set(position, ans);
    const findAddress = (arr) => {
      if (arr[0] === 'Address') {
        ans.add(arr[1]);
      }
      arr.forEach((element) => {
        if (Array.isArray(element)) {
          findAddress(element);
        }
      });
    };
    findAddress(parser);
    this.treeOut.get(position).forEach((element) => {
      this.getCell(element);
      this.treeIn.get(element).add(position);
    });
    const updateNeedCalc = (address) => {
      if (!this.getCell(address).needCalc) {
        this.getCell(address).needCalc = true;
        this.treeIn.get(address).forEach((element) => updateNeedCalc(element));
      }
    };
    updateNeedCalc(position);
  }
}
