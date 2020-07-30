import CellColumnSort from './CellColumnSort.js';
import { valueTypes } from '../spreadsheets/Cell.js';

export default class StringSort extends CellColumnSort {
  constructor(column, isInAlphabetOrder) {
    super(column);
    if (typeof isInAlphabetOrder === 'boolean') {
      this.isInAlphabetOrder = isInAlphabetOrder;
    } else {
      throw new TypeError('isInAlphabetOrder should be boolean');
    }
  }

  compareFunction(cellA, cellB) {
    const isATypeCorrect = cellA.type === valueTypes.string;
    const isBTypeCorrect = cellB.type === valueTypes.string;
    if (!isATypeCorrect && !isBTypeCorrect) {
      return 0;
    } if (!isATypeCorrect) {
      return 1;
    } if (!isBTypeCorrect) {
      return -1;
    }
    if (this.isInAlphabetOrder) {
      return cellA.value.localeCompare(cellB.value);
    }
    return -(cellA.value.localeCompare(cellB.value));
  }
}
