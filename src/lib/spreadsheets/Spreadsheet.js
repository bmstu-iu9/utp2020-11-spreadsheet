import { Cell } from './Cell.js';

export default class Spreadsheet {
  constructor(name, cells = new Map()) {
    this.setName(name);
    this.setCells(cells);
  }

  setName(name) {
    if (typeof name !== 'string') {
      throw new Error('Spreadsheet name must be a string');
    }
    this.name = name;
  }

  setCells(cells) {
    if (cells instanceof Map) {
      cells.forEach((cell, position) => {
        if (!Spreadsheet.isPositionCorrect(position)) {
          throw new Error('Illegal position');
        }
        if (!(cell instanceof Cell)) {
          throw new Error('Map values must be cells');
        }
      });
      this.cells = cells;
    } else {
      throw new Error('Cells must be a Map');
    }
  }

  getCell(position) {
    if (Spreadsheet.isPositionCorrect(position)) {
      if (!this.cells.has(position)) {
        this.cells.set(position, new Cell());
      }
      return this.cells.get(position);
    }
    throw new Error('Illegal position');
  }

  static isPositionCorrect(position) {
    const positionRegExp = new RegExp('^[A-Z]+[1-9][0-9]*$');
    return positionRegExp.test(position);
  }
}
