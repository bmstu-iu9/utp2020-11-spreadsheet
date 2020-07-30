import CellColumnSort from './CellColumnSort.js';
import { valueTypes } from '../spreadsheets/Cell.js';

export default class StringSort extends CellColumnSort {
  constructor(column, isInAlphabetOrder) {
    super(column);
    this.valueType = valueTypes.string;
    if (typeof isInAlphabetOrder === 'boolean') {
      this.isInAlphabetOrder = isInAlphabetOrder;
    } else {
      throw new TypeError('isInAlphabetOrder should be boolean');
    }
  }

  compareFunction(cellA, cellB) {
    if (this.isInAlphabetOrder) {
      return cellA.value.localeCompare(cellB.value);
    }
    return -(cellA.value.localeCompare(cellB.value));
  }
}
