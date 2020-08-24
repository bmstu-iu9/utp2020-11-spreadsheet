// eslint-disable-next-line max-classes-per-file
function $(id) {
  return document.getElementById(id);
}

class Table {
  constructor(tableObj) {
    this.table = tableObj;
    this.focusedXY = undefined;
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
  }

  blur() {
    if (this.focusedXY) {
      this.getCell(this.focusedXY[0], this.focusedXY[1]).children[0].blur();
      this.getCell(this.focusedXY[0], this.focusedXY[1]).children[0].classList.remove('cursor-text');
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

class SelectionSquare {
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

class Selection {
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

const table = new Table($('table'));
const currentSelection = new Selection($('table'));
let currentSelectionSquare;

// eslint-disable-next-line array-callback-return
table.reduce((cell) => {
  cell.addEventListener('mousedown', (e) => {
    e.preventDefault();
    table.blur();
    if (!currentSelection.isEmpty() && !e.ctrlKey) {
      currentSelection.removeAll();
    }
    if (e.shiftKey) {
      currentSelectionSquare = new SelectionSquare(currentSelectionSquare.start,
        Table.getCellXY(cell), table);
    } else if (currentSelection.isEmpty() || e.ctrlKey) {
      currentSelectionSquare = new SelectionSquare(Table.getCellXY(cell),
        Table.getCellXY(cell), table);
    }
    currentSelectionSquare.change();
    currentSelection.add(currentSelectionSquare);
  });
  cell.addEventListener('mouseover', () => {
    if (currentSelectionSquare !== undefined && !currentSelectionSquare.isSelected) {
      currentSelectionSquare.change(Table.getCellXY(cell));
    }
  });
  cell.addEventListener('mouseup', () => {
    currentSelectionSquare.apply();
  });
  cell.addEventListener('dblclick', () => {
    table.focus(cell);
  });
});

table.reduceRowHeaders((rowHeader) => {
  rowHeader.addEventListener('dblclick', (e) => {
    e.preventDefault();
    if (!currentSelection.isEmpty() && !e.ctrlKey) {
      currentSelection.removeAll();
    }
    if (e.shiftKey) {
      currentSelectionSquare = new SelectionSquare(currentSelectionSquare.start,
        [table.getWidth() - 1, rowHeader.parentNode.rowIndex - 1], table);
    } else if (currentSelection.isEmpty() || e.ctrlKey) {
      currentSelectionSquare = new SelectionSquare([0, rowHeader.parentNode.rowIndex - 1],
        [table.getWidth() - 1, rowHeader.parentNode.rowIndex - 1], table);
    }
    currentSelection.add(currentSelectionSquare);
    currentSelectionSquare.apply();
  });
});

table.reduceColumnHeaders((columnHeader) => {
  columnHeader.addEventListener('dblclick', (e) => {
    e.preventDefault();
    if (!currentSelection.isEmpty() && !e.ctrlKey) {
      currentSelection.removeAll();
    }
    if (e.shiftKey) {
      currentSelectionSquare = new SelectionSquare(currentSelectionSquare.start,
        [columnHeader.cellIndex - 1, table.getHeight() - 1], table);
    } else if (currentSelection.isEmpty() || e.ctrlKey) {
      currentSelectionSquare = new SelectionSquare([columnHeader.cellIndex - 1, 0],
        [columnHeader.cellIndex - 1, table.getHeight() - 1], table);
    }
    currentSelection.add(currentSelectionSquare);
    currentSelectionSquare.apply();
  });
});
