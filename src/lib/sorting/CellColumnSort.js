import ColumnFilter from '../filters/ColumnFilter.js';
import { Cell } from '../spreadsheets/Cell.js';
import FormatError from '../../Errors/FormatError.js';

export default class CellColumnSort {
  constructor(column) {
    this.setColumn(column);
  }

  setColumn(column) {
    this.columnFilter = new ColumnFilter(column);
  }

  run(rows) {
    let emptyRowsCount = 0;
    const rowsAndCells = [];
    rows.forEach((cells) => {
      const filteredCells = this.columnFilter.run(cells);
      if (filteredCells.size > 1) {
        throw new FormatError('two cells on one position');
      }
      if (filteredCells.size === 0) {
        rowsAndCells.push({
          position: emptyRowsCount,
          cells,
        });
        emptyRowsCount += 1;
      } else {
        filteredCells.forEach((cell, position) => {
          if (!(cell instanceof Cell)) {
            throw new TypeError('cell expected');
          }
          rowsAndCells.push({
            position,
            cells,
          });
        });
      }
    });
    rowsAndCells.sort((a, b) => {
      const isAEmpty = !this.columnFilter.doesPositionMatch(a.position);
      const isBEmpty = !this.columnFilter.doesPositionMatch(b.position);
      if (isAEmpty && isBEmpty) {
        return 0;
      }
      if (isBEmpty) {
        return -1;
      }
      if (isAEmpty) {
        return 1;
      }
      const cellA = a.cells.get(a.position);
      const cellB = b.cells.get(b.position);
      return this.compareFunction(cellA, cellB);
    });

    const rightOrderedRows = [];
    rowsAndCells.forEach((pair) => rightOrderedRows.push(pair.cells));
    return rightOrderedRows;
  }
}
