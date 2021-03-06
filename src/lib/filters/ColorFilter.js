import CellColumnFilter from './CellColumnFilter.js';
import { Cell } from '../spreadsheets/Cell.js';
import FormatError from '../errors/FormatError.js';

export default class ColorFilter extends CellColumnFilter {
  constructor(column, colors) {
    super(column);
    this.setColors(colors);
  }

  setColors(colors) {
    if (!(colors instanceof Array)) {
      throw new TypeError('expected an array');
    }
    colors.forEach((color) => {
      if (!Cell.isColorCorrect(color)) {
        throw new FormatError('invalid color');
      }
    });
    this.colors = colors;
  }

  doesCellMatch(cell) {
    return this.colors.includes(cell.color);
  }
}
