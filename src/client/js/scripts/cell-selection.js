import Selection from './Selection.js';
import CellValueRenderer from './CellValueRenderer.js';
import SelectionSquare from './SelectionSquare.js';
import Table from './Table.js';
import Workbook from '../../../lib/spreadsheets/Workbook.js';
import Spreadsheet from '../../../lib/spreadsheets/Spreadsheet.js';

function $(id) {
  return document.getElementById(id);
}

const workbook = new Workbook('test', [new Spreadsheet('test')]);
const renderer = new CellValueRenderer(workbook);
const table = new Table($('table'), renderer);
const currentSelection = new Selection($('table'));
let currentSelectionSquare;

document.addEventListener('mouseup', (e) => {
  if (currentSelectionSquare && !currentSelectionSquare.isSelected && !e.target.classList.contains('cell')) {
    currentSelectionSquare.apply();
  }
});

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
