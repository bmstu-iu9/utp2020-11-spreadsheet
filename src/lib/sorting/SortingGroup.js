import Spreadsheet from '../spreadsheets/Spreadsheet.js';
import RegionFilter from '../filters/RegionFilter.js';
import CellColumnSort from './CellColumnSort.js';

export default class SortingGroup {
  constructor(start, finish, cellColumnSorts = []) {
    this.setRegion(start, finish);
    this.setCellColumnSorts(cellColumnSorts);
  }

  run(spreadsheet) {
    if (!(spreadsheet instanceof Spreadsheet)) {
      throw new TypeError('invalid spreadsheet');
    }
    const regionCells = this.regionFilter.run(spreadsheet.cells);
    const rows = new Map();
    regionCells.forEach((cell, position) => {
      const { row } = RegionFilter.getColumnRowFromPosition(position);
      if (!(rows.has(row))) {
        rows.set(row, new Map());
      }
      rows.get(row).set(position, cell);
    });
    let rowsArray = [];
    rows.forEach((...args) => {
      rowsArray.push(args[0]);
    });
    this.cellColumnSorts.forEach((sort) => {
      rowsArray = sort.run(rowsArray);
    });
    return rowsArray;
  }

  setRegion(start, finish) {
    this.regionFilter = new RegionFilter(start, finish);
  }

  setCellColumnSorts(cellColumnSorts) {
    if (!(cellColumnSorts instanceof Array)) {
      throw new TypeError('cell column sorts must be an array');
    }
    cellColumnSorts.forEach((sort) => {
      if (!(sort instanceof CellColumnSort)) {
        throw new TypeError('invalid column sort');
      }
    });
    this.cellColumnSorts = cellColumnSorts;
  }
}
