import ColumnFilter from './ColumnFilter.js';
import { Cell } from '../spreadsheets/Cell.js';
import FormatError from '../errors/FormatError.js';

export default class CellColumnFilter {
  constructor(column) {
    this.setColumn(column);
  }

  setColumn(column) {
    this.columnFilter = new ColumnFilter(column);
  }

  run(rows) {
    return rows.filter((cells) => {
      const filteredCells = this.columnFilter.run(cells);
      const values = Array.from(filteredCells.values());
      if (values.length > 1) {
        throw new FormatError('two cells on one position');
      }
      if (values.length === 0) {
        return true;
      }
      const cell = values[0];
      if (!(cell instanceof Cell)) {
        throw new TypeError('cell expected');
      }
      return this.doesCellMatch(cell);
    });
  }
}
