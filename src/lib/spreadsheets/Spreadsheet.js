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
    this.dependOn = new Map();
    this.dependenciesOf = new Map();
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
        this.dependOn.set(position, new Set());
        this.dependenciesOf.set(position, new Set());
      });
      this.cells = cells;
    } else {
      throw new TypeError('Cells must be a Map');
    }
  }

  initializeCell(position) {
    if (!Spreadsheet.isPositionCorrect(position)) {
      throw new FormatError('Illegal position');
    }
    if (!this.cells.has(position)) {
      this.cells.set(position, new Cell());
      this.dependOn.set(position, new Set());
      this.dependenciesOf.set(position, new Set());
    }
  }

  getCell(position) {
    if (!Spreadsheet.isPositionCorrect(position)) {
      throw new FormatError('Illegal position');
    }
    this.initializeCell(position);
    return this.cells.get(position);
  }

  static isPositionCorrect(position) {
    const positionRegExp = new RegExp('^[A-Z]+[1-9][0-9]*$');
    return positionRegExp.test(position);
  }

  static isColumnCorrect(column) {
    const columnRegExp = new RegExp('^[A-Z]+$');
    return columnRegExp.test(column);
  }

  static findAddress(arr, ans) {
    if (arr[0] === 'Address') {
      ans.add(arr[1]);
    }
    arr.forEach((element) => {
      if (Array.isArray(element)) {
        Spreadsheet.findAddress(element, ans);
      }
    });
  }

  updateNeedCalc(address) {
    if (!this.getCell(address).needCalc) {
      this.getCell(address).needCalc = true;
      this.dependOn.get(address).forEach((element) => this.updateNeedCalc(element));
    }
  }

  setValueInCell(position, type, value) {
    this.getCell(position).setValue(type, value);
    this.dependenciesOf.get(position).forEach((element) => {
      this.dependOn.get(element).delete(position);
    });
    const parser = (type === valueTypes.formula ? new Parser(value).run() : []);
    const ans = new Set();
    this.dependenciesOf.set(position, ans);
    Spreadsheet.findAddress(parser, ans);
    this.dependenciesOf.get(position).forEach((element) => {
      this.initializeCell(element);
      this.dependOn.get(element).add(position);
    });
    this.updateNeedCalc(position);
  }

  static getPositionByIndexes(row, column) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let reversedColumnString = '';
    let number = column;
    let wordsWithNumberCharacters = 1;
    while (number >= 0) {
      const currentCharacter = Math.floor(number / wordsWithNumberCharacters) % alphabet.length;
      reversedColumnString += alphabet[currentCharacter];
      wordsWithNumberCharacters *= alphabet.length;
      number -= wordsWithNumberCharacters;
    }
    let columnString = '';
    for (let j = reversedColumnString.length - 1; j >= 0; j -= 1) {
      columnString += reversedColumnString[j];
    }
    return `${columnString}${row + 1}`;
  }
}
