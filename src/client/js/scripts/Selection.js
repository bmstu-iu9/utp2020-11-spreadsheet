export default class Selection {
  constructor(table) {
    this.table = table;
    this.selectionSquares = [];
  }

  add(selectionSquare) {
    this.selectionSquares.push(selectionSquare);
  }

  removeAll() {
    this.selectionSquares.forEach((selection) => {
      selection.remove();
    });
    this.selectionSquares = [];
  }

  reduceAll(func) {
    this.selectionSquares.forEach((selection) => {
      this.table.reduce(func, selection.start, selection.end);
    });
  }

  isEmpty() {
    return this.selectionSquares.length === 0;
  }

  getMainCell() {
    return this.table.getCell(this.selectionSquares[0].start[0], this.selectionSquares[0].start[1]);
  }

  getMainCellInput() {
    return this.table.getCell(this.selectionSquares[0].start[0],
      this.selectionSquares[0].start[1]).children[0];
  }
}
