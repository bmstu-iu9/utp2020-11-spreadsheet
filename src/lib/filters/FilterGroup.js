import RegionFilter from './RegionFilter.js';
import CellColumnFilter from './CellColumnFilter.js';
import Spreadsheet from '../spreadsheets/Spreadsheet.js';

export default class FilterGroup {
  constructor(start, finish, cellColumnFilters = []) {
    this.setRegion(start, finish);
    this.setCellColumnFilters(cellColumnFilters);
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
    const rowsArray = [];
    rows.forEach((...args) => {
      rowsArray.push(args[0]);
    });
    const rowsPassed = new Map();
    rowsArray.forEach((row) => {
      rowsPassed.set(row, 0);
    });
    this.cellColumnFilters.forEach((filter) => {
      filter.run(rowsArray).forEach((row) => {
        rowsPassed.set(row, rowsPassed.get(row) + 1);
      });
    });
    return rowsArray.filter((row) => rowsPassed.get(row) === this.cellColumnFilters.length);
  }

  setRegion(start, finish) {
    this.regionFilter = new RegionFilter(start, finish);
  }

  setCellColumnFilters(cellColumnFilters) {
    if (!(cellColumnFilters instanceof Array)) {
      throw new TypeError('cell column filters must be an array');
    }
    cellColumnFilters.forEach((filter) => {
      if (!(filter instanceof CellColumnFilter)) {
        throw new TypeError('invalid column filter');
      }
    });
    this.cellColumnFilters = cellColumnFilters;
  }
}
