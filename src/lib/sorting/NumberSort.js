import CellColumnSort from './CellColumnSort.js';
import { valueTypes } from '../spreadsheets/Cell.js';

export default class NumberSort extends CellColumnSort {
  constructor(column, isDescending) {
    super(column);
    this.valueType = valueTypes.number;
    if (typeof isDescending === 'boolean') {
      this.isDescending = isDescending;
    } else {
      throw new TypeError('isDescending should be boolean');
    }
  }

  compareFunction(cellA, cellB) {
    if (this.isDescending) {
      return cellA.value - cellB.value;
    }
    return -(cellA.value - cellB.value);
  }
}
