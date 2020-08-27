import Selection from './Selection.js';
import SelectionSquare from './SelectionSquare.js';
import Table from './Table.js';
import StyleToolButton from './StyleToolButton.js';
import StyleToolInput from './StyleToolInput.js';
import StyleToolBorder from './StyleToolBorder.js';

function $(id) {
  return document.getElementById(id);
}

function prepareSelection(table, currentSelection, currentSelectionSquare) {
  // eslint-disable-next-line array-callback-return
  table.reduce((cell) => {
    cell.addEventListener('mousedown', (e) => {
      e.preventDefault();
      table.blur();
      if (!currentSelection.isEmpty() && !e.ctrlKey) {
        currentSelection.removeAll();
      }
      if (e.shiftKey) {
        // eslint-disable-next-line no-param-reassign
        currentSelectionSquare = new SelectionSquare(currentSelectionSquare.start,
          Table.getCellXY(cell), table);
      } else if (currentSelection.isEmpty() || e.ctrlKey) {
        // eslint-disable-next-line no-param-reassign
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
      currentSelection.applyAll();
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
        // eslint-disable-next-line no-param-reassign
        currentSelectionSquare = new SelectionSquare(currentSelectionSquare.start,
          [table.getWidth() - 1, rowHeader.parentNode.rowIndex - 1], table);
      } else if (currentSelection.isEmpty() || e.ctrlKey) {
        // eslint-disable-next-line no-param-reassign
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
        // eslint-disable-next-line no-param-reassign
        currentSelectionSquare = new SelectionSquare(currentSelectionSquare.start,
          [columnHeader.cellIndex - 1, table.getHeight() - 1], table);
      } else if (currentSelection.isEmpty() || e.ctrlKey) {
        // eslint-disable-next-line no-param-reassign
        currentSelectionSquare = new SelectionSquare([columnHeader.cellIndex - 1, 0],
          [columnHeader.cellIndex - 1, table.getHeight() - 1], table);
      }
      currentSelection.add(currentSelectionSquare);
      currentSelectionSquare.apply();
    });
  });
}

function prepareStyleTools(currentSelection) {
  const styleToolButtons = new Map();
  ['bold', 'italic', 'underline', 'line-through'].forEach((style) => {
    styleToolButtons.set(style, new StyleToolButton(currentSelection, $(`button-${style}`), false, style));
  });
  styleToolButtons.get('underline').setConflict('line-through', 'underline-line-through');
  styleToolButtons.get('line-through').setConflict('underline', 'underline-line-through');
  const upperCaseFunc = (cell) => {
    cell.children[0].value = cell.children[0].value.toUpperCase();
  };
  const lowerCaseFunc = (cell) => {
    cell.children[0].value = cell.children[0].value.toLowerCase();
  };
  styleToolButtons.set('upperCase', new StyleToolButton(currentSelection, $('button-upperCase'),
    (cell) => upperCaseFunc(cell), false));
  styleToolButtons.set('lowerCase', new StyleToolButton(currentSelection, $('button-lowerCase'),
    (cell) => lowerCaseFunc(cell), false));

  const styleToolLists = new Map();
  ['fontFamily', 'fontSize'].forEach((style) => {
    styleToolLists.set(style, new StyleToolInput(currentSelection, $(`tool-${style}`), style, 'list'));
  });

  const styleToolRadios = new Map();
  ['color', 'backgroundColor'].forEach((style) => {
    styleToolRadios.set(style, new StyleToolInput(currentSelection, $(`tool-${style}`), style, 'color'));
  });
  ['borderColor'].forEach((style) => {
    styleToolRadios.set(style, new StyleToolInput(currentSelection, $(`tool-${style}`), style, 'color', true));
  });

  // eslint-disable-next-line no-unused-vars
  const borderStyleTool = new StyleToolBorder(currentSelection, $('tool-border'));
}

function prepare() {
  const table = new Table($('table'));
  const currentSelection = new Selection(table);
  let currentSelectionSquare;

  prepareSelection(table, currentSelection, currentSelectionSquare);
  prepareStyleTools(currentSelection);
}

prepare();
