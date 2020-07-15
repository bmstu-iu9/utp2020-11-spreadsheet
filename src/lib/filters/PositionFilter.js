export default class PositionFilter {
  run(cells) {
    const filteredCells = new Map();
    cells.forEach((cell, position) => {
      if (this.doesPositionMatch(position)) {
        filteredCells.set(position, cell);
      }
    });
    return filteredCells;
  }
}
