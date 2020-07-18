import PositionFilter from './PositionFilter.js';
import Spreadsheet from '../spreadsheets/Spreadsheet.js';

export default class ColumnFilter extends PositionFilter {
  constructor(column) {
    super();
    this.setColumn(column);
  }

  setColumn(column) {
    if (!Spreadsheet.isColumnCorrect(column)) {
      throw new Error('invalid column');
    }
    this.regExp = new RegExp(`${column}[1-9][0-9]*`);
  }

  doesPositionMatch(position) {
    return this.regExp.test(position);
  }
}
