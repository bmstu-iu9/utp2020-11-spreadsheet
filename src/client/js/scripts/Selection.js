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

  isEmpty() {
    return this.selectionSquares.length === 0;
  }
}
