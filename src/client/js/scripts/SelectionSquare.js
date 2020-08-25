export default class SelectionSquare {
  constructor(pointFirst, pointSecond, table) {
    this.start = pointFirst;
    this.end = pointSecond;
    this.table = table;
    this.isSelected = false;
  }

  sync() {
    const startOld = this.start;
    const endOld = this.end;
    this.start = [Math.min(startOld[0], endOld[0]), Math.min(startOld[1], endOld[1])];
    this.end = [Math.max(startOld[0], endOld[0]), Math.max(startOld[1], endOld[1])];
  }

  getStart() {
    return [Math.min(this.start[0], this.end[0]), Math.min(this.start[1], this.end[1])];
  }

  getEnd() {
    return [Math.max(this.start[0], this.end[0]), Math.max(this.start[1], this.end[1])];
  }

  draw(style) {
    // eslint-disable-next-line array-callback-return
    this.table.reduce((cell) => {
      cell.classList.add(style);
    }, this.getStart(), this.getEnd());
  }

  erase(style) {
    // eslint-disable-next-line array-callback-return
    this.table.reduce((cell) => {
      cell.classList.remove(style);
    }, this.getStart(), this.getEnd());
  }

  change(newPoint = this.end) {
    this.erase('selection');
    this.end = newPoint;
    this.draw('selection');
  }

  apply() {
    this.erase('selection');
    this.draw('selected');
    this.isSelected = true;
  }

  remove() {
    this.erase('selected');
  }
}
