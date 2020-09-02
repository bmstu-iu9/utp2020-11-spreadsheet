import Selection from './Selection.js';
import CellValueRenderer from './CellValueRenderer.js';
import SelectionSquare from './SelectionSquare.js';
import Table from './Table.js';
import StyleToolButton from './StyleToolButton.js';
import StyleToolInput from './StyleToolInput.js';
import StyleToolBorder from './StyleToolBorder.js';
import Workbook from '../../../lib/spreadsheets/Workbook.js';
import Spreadsheet from '../../../lib/spreadsheets/Spreadsheet.js';

function $(id) {
  return document.getElementById(id);
}

function updateStyleButtons(buttons, lists) {
  buttons.forEach((button) => {
    button.buttonHTML.dispatchEvent(new Event('change'));
  });
  lists.forEach((list) => {
    list.input.dispatchEvent(new Event('change'));
  });
}

function prepareSelection(table, currentSelection, currentSelectionSquare, buttons, lists) {
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
      updateStyleButtons(buttons, lists);
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
      updateStyleButtons(buttons, lists);
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
      updateStyleButtons(buttons, lists);
    });
  });
}

function setConflictStyles(buttons) {
  buttons.get('underline').setConflict(['line-through'], 'underline-line-through');
  buttons.get('line-through').setConflict(['underline'], 'underline-line-through');
  buttons.get('align-left').setConflict(['align-right', 'align-center']);
  buttons.get('align-right').setConflict(['align-left', 'align-center']);
  buttons.get('align-center').setConflict(['align-right', 'align-left']);
}

function prepareStyleTools(table, currentSelection, currentSelectionSquare) {
  const styleToolButtons = new Map();
  ['bold', 'italic', 'underline', 'line-through', 'align-left', 'align-right', 'align-center'].forEach((style) => {
    styleToolButtons.set(style, new StyleToolButton(currentSelection, $(`button-${style}`), false, style));
  });
  setConflictStyles(styleToolButtons);

  const upperCaseFunc = (cell) => {
    cell.children[0].value = cell.children[0].value.toUpperCase();
  };
  const lowerCaseFunc = (cell) => {
    cell.children[0].value = cell.children[0].value.toLowerCase();
  };
  const insertTabFunc = (cell) => {
    const { value } = cell.children[0];
    const charsNew = [];
    charsNew.push(String.fromCharCode(9));
    for (let i = 0; i < value.length; i += 1) {
      charsNew.push(value.charAt(i));
      if (value.charCodeAt(i) === 10) {
        charsNew.push(String.fromCharCode(9));
      }
    }
    cell.children[0].value = charsNew.join('');
  };
  const removeTabFunc = (cell) => {
    const { value } = cell.children[0];
    const stringNew = [];
    const strings = value.split(String.fromCharCode(10));
    strings.forEach((s) => {
      if (s.charCodeAt(0) === 9) {
        stringNew.push(s.slice(1, s.length));
      } else {
        stringNew.push(s);
      }
    });
    cell.children[0].value = stringNew.join(String.fromCharCode(10));
  };
  styleToolButtons.set('upperCase', new StyleToolButton(currentSelection, $('button-upperCase'),
    (cell) => upperCaseFunc(cell), false));
  styleToolButtons.set('lowerCase', new StyleToolButton(currentSelection, $('button-lowerCase'),
    (cell) => lowerCaseFunc(cell), false));
  styleToolButtons.set('indent-increase', new StyleToolButton(currentSelection, $('button-indent-increase'),
    (cell) => insertTabFunc(cell), false));
  styleToolButtons.set('indent-decrase', new StyleToolButton(currentSelection, $('button-indent-decrease'),
    (cell) => removeTabFunc(cell), false));

  const styleToolLists = new Map();
  ['fontFamily', 'fontSize'].forEach((style) => {
    styleToolLists.set(style, new StyleToolInput(currentSelection, $(`tool-${style}`), style, 'list'));
  });
  styleToolLists.get('fontFamily').setDefault('Arial');
  styleToolLists.get('fontSize').setDefault('13px');

  const styleToolRadios = new Map();
  ['color', 'backgroundColor'].forEach((style) => {
    styleToolRadios.set(style, new StyleToolInput(currentSelection, $(`tool-${style}`), style, 'color'));
  });
  ['borderColor'].forEach((style) => {
    styleToolRadios.set(style, new StyleToolInput(currentSelection, $(`tool-${style}`), style, 'color', true));
  });

  // eslint-disable-next-line no-unused-vars
  const borderStyleTool = new StyleToolBorder(currentSelection, $('tool-border'));

  prepareSelection(table, currentSelection,
    currentSelectionSquare, styleToolButtons, styleToolLists);
}

function prepare() {
  const workbook = new Workbook('test', [new Spreadsheet('test')]);
  const renderer = new CellValueRenderer(workbook);
  const table = new Table($('table'), renderer);
  const currentSelection = new Selection(table);
  let currentSelectionSquare;

  prepareStyleTools(table, currentSelection, currentSelectionSquare);
}

prepare();
