import StringValueFilter from './StringValueFilter.js';
import { valueTypes } from '../spreadsheets/Cell.js';

export default class StringPrefixFilter extends StringValueFilter {
  doesCellMatch(cell) {
    if (cell.type !== valueTypes.string) {
      return false;
    }
    const filtered = this.values.filter((value) => cell.value.startsWith(value));
    return filtered.length !== 0;
  }
}
