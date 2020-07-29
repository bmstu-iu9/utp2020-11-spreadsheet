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
    if (cellA.type === valueTypes.number && cellB.type === valueTypes.number) {
      if (this.isDescending) {
        return cellA.value - cellB.value;
      }
      return -(cellA.value - cellB.value);
    }
    throw new TypeError('number expected');
  }
}
