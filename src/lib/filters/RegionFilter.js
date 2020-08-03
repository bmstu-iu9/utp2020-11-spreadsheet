import PositionFilter from './PositionFilter.js';
import Spreadsheet from '../spreadsheets/Spreadsheet.js';
import FormatError from '../../errors/FormatError.js';

export default class RegionFilter extends PositionFilter {
  constructor(start, finish) {
    super();
    this.setBounds(start, finish);
  }

  doesPositionMatch(position) {
    if (!Spreadsheet.isPositionCorrect(position)) {
      throw new FormatError('invalid position');
    }
    const { column, row } = RegionFilter.getColumnRowFromPosition(position);
    return this.doesColumnMatch(column) && this.doesRowMatch(row);
  }

  setBounds(start, finish) {
    if (!Spreadsheet.isPositionCorrect(start)) {
      throw new FormatError('invalid start position');
    }
    if (!Spreadsheet.isPositionCorrect(finish)) {
      throw new FormatError('invalid finish position');
    }
    this.start = RegionFilter.getColumnRowFromPosition(start);
    this.finish = RegionFilter.getColumnRowFromPosition(finish);
  }

  static isColumnLess(first, second) {
    if (first.length < second.length) {
      return true;
    }
    if (first.length > second.length) {
      return false;
    }
    return first < second;
  }

  doesRowMatch(row) {
    const startNumber = Number.parseInt(this.start.row, 10);
    const rowNumber = Number.parseInt(row, 10);
    const finishNumber = Number.parseInt(this.finish.row, 10);
    return (startNumber <= rowNumber && rowNumber <= finishNumber)
      || (finishNumber <= rowNumber && rowNumber <= startNumber);
  }

  doesColumnMatch(column) {
    if (column === this.start.column || column === this.finish.column) {
      return true;
    }
    if (RegionFilter.isColumnLess(this.start.column, column)
      && RegionFilter.isColumnLess(column, this.finish.column)) {
      return true;
    }
    if (RegionFilter.isColumnLess(this.finish.column, column)
      && RegionFilter.isColumnLess(column, this.start.column)) {
      return true;
    }
    return false;
  }

  static getColumnRowFromPosition(position) {
    let column = '';
    let row = '';
    for (let i = 0; i < position.length; i += 1) {
      const character = position[i];
      const isNumber = !Number.isNaN(Number.parseInt(character, 10));
      if (isNumber) {
        row += character;
      } else {
        column += character;
      }
    }
    return { column, row };
  }
}
