import CellColumnSort from './CellColumnSort.js';
import { Cell } from '../spreadsheets/Cell.js';
import FormatError from '../../Errors/FormatError.js';

export default class ColorSort extends CellColumnSort {
  constructor(column, colors) {
    super(column);
    this.setColors(colors);
  }

  setColors(colors) {
    if (!(colors instanceof Array)) {
      throw new TypeError('colors must be an array');
    }
    colors.forEach((color) => {
      if (!Cell.isColorCorrect(color)) {
        throw new FormatError('invalid color');
      }
    });
    this.colors = colors;
  }

  compareFunction(cellA, cellB) {
    const posA = this.colors.indexOf(cellA.color);
    const posB = this.colors.indexOf(cellB.color);
    if (posA === -1 && posB === -1) {
      return 0;
    } if (posA === -1) {
      return 1;
    } if (posB === -1) {
      return -1;
    }
    return posA - posB;
  }
}
