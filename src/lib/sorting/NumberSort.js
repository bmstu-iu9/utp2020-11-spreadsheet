import CellColumnSort from './CellColumnSort.js';
import { valueTypes } from '../spreadsheets/Cell.js';

export default class NumberSort extends CellColumnSort {
  constructor(column, isDescending) {
    super(column);
    if (typeof isDescending === 'boolean') {
      this.isDescending = isDescending;
    } else {
      throw new TypeError('isDescending should be boolean');
    }
  }

  compareFunction(cellA, cellB) {
    const isATypeCorrect = cellA.type === valueTypes.number;
    const isBTypeCorrect = cellB.type === valueTypes.number;
    if (!isATypeCorrect && !isBTypeCorrect) {
      return 0;
    } if (!isATypeCorrect) {
      return 1;
    } if (!isBTypeCorrect) {
      return -1;
    }
    if (this.isDescending) {
      return cellA.value - cellB.value;
    }
    return -(cellA.value - cellB.value);
  }
}
