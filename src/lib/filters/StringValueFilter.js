import CellColumnFilter from './CellColumnFilter.js';
import { valueTypes } from '../spreadsheets/Cell.js';

export default class StringValueFilter extends CellColumnFilter {
  constructor(column, values = []) {
    super(column);
    this.setValues(values);
  }

  setValues(values) {
    if (!(values instanceof Array)) {
      throw new TypeError('values must be an array');
    }
    values.forEach((value) => {
      if (typeof value !== 'string') {
        throw new TypeError('all values must be strings');
      }
    });
    this.values = values;
  }

  doesCellMatch(cell) {
    return cell.type === valueTypes.string && this.values.includes(cell.value);
  }
}
