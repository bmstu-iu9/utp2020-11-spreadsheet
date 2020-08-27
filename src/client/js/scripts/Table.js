export default class Table {
  constructor(tableObj, cellValueRenderer) {
    this.table = tableObj;
    this.cellValueRenderer = cellValueRenderer;
  }

  getHeight() {
    return this.table.rows.length - 1;
  }

  getWidth() {
    return this.table.rows[1].cells.length - 1;
  }

  getRow(i) {
    return this.table.rows[i + 1];
  }

  getCell(i, j) {
    return this.table.rows[j + 1].cells[i + 1];
  }

  getRowHeader(i) {
    return this.table.rows[i + 1].cells[0];
  }

  getColumnHeader(i) {
    return this.table.rows[0].cells[i + 1];
  }

  focus(cell) {
    cell.children[0].focus();
    cell.children[0].classList.add('cursor-text');
    this.focusedXY = Table.getCellXY(cell);
    this.cellValueRenderer.activate(this.focusedXY[1], this.focusedXY[0], cell);
  }

  blur() {
    if (this.focusedXY) {
      const cell = this.getCell(this.focusedXY[0], this.focusedXY[1]);
      cell.blur();
      cell.children[0].classList.remove('cursor-text');
      cell.children[0].blur();
      this.cellValueRenderer.deactivate(this.focusedXY[1], this.focusedXY[0], cell);
      this.focusedXY = false;
    }
  }

  reduce(func, start = [0, 0], end = [this.getWidth() - 1, this.getHeight() - 1]) {
    for (let i = start[1]; i <= end[1]; i += 1) {
      for (let j = start[0]; j <= end[0]; j += 1) {
        func(this.getCell(j, i));
      }
    }
  }

  reduceColumnHeaders(func, start = 0, end = this.getWidth() - 1) {
    for (let i = start; i < end; i += 1) {
      func(this.getColumnHeader(i));
    }
  }

  reduceRowHeaders(func, start = 0, end = this.getHeight() - 1) {
    for (let i = start; i < end; i += 1) {
      func(this.getRowHeader(i));
    }
  }

  static getCellXY(cell) {
    return [cell.cellIndex - 1, cell.parentElement.rowIndex - 1];
  }
}
