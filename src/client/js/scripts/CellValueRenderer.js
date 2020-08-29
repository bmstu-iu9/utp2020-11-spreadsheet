import Workbook from '../../../lib/spreadsheets/Workbook.js';
import { valueTypes } from '../../../lib/spreadsheets/Cell.js';
import Spreadsheet from '../../../lib/spreadsheets/Spreadsheet.js';

export default class CellValueRenderer {
  constructor(workbook) {
    this.setWorkbook(workbook);
    [this.cellInfo] = document.getElementsByClassName('cell-info');
  }

  activate(tableObj, row, column, cell) {
    const position = Spreadsheet.getPositionByIndexes(row, column);
    const initialValueString = this.workbook.spreadsheets[0].getCell(position).value;
    const cellToChange = cell;
    cellToChange.childNodes[0].value = initialValueString;
    this.syncWithCellInfo(tableObj, row, column, cellToChange);
    cellToChange.oninput = () => {
      const valueString = cellToChange.childNodes[0].value;
      this.cellInfo.value = valueString;
      const valueType = CellValueRenderer.getCellValueType(valueString);
      this.workbook.spreadsheets[0].setValueInCell(
        position, valueType.type, valueType.value,
      );
    };
  }

  syncWithCellInfo(tableObj, row, column, cell) {
    const position = Spreadsheet.getPositionByIndexes(row, column);
    const cellToChange = cell;
    const initialValueString = this.workbook.spreadsheets[0].getCell(position).value;
    this.cellInfo.value = initialValueString;
    this.cellInfo.oninput = () => {
      const valueType = CellValueRenderer.getCellValueType(this.cellInfo.value);
      this.workbook.spreadsheets[0].setValueInCell(
        position, valueType.type, valueType.value,
      );
      try {
        cellToChange.childNodes[0].value = this.workbook.getProcessedValue(position).value;
        this.updateAllDependents(position, tableObj);
      } catch (err) {
        cellToChange.childNodes[0].value = 'Ошибка';
      }
    };
  }

  deactivate(tableObj, row, column, cell) {
    const position = Spreadsheet.getPositionByIndexes(row, column);
    const cellToChange = cell;
    try {
      cellToChange.childNodes[0].value = this.workbook.getProcessedValue(position).value;
      this.updateAllDependents(position, tableObj);
    } catch (err) {
      cellToChange.childNodes[0].value = 'Ошибка';
    }
    cellToChange.oninput = null;
    this.cellInfo.oninput = null;
    this.cellInfo.value = '';
  }

  static getCellValueType(valueString) {
    if (valueString === 'true' || valueString === 'false') {
      return {
        type: valueTypes.boolean,
        value: (valueString === 'true'),
      };
    }
    if (valueString.startsWith('=')) {
      return {
        type: valueTypes.formula,
        value: valueString,
      };
    }
    const parsedNumber = Number.parseFloat(valueString);
    if (!Number.isNaN(parsedNumber)) {
      return {
        type: valueTypes.number,
        value: parsedNumber,
      };
    }
    return {
      type: valueTypes.string,
      value: valueString,
    };
  }

  updateAllDependents(position, tableObj) {
    const [row, column] = Spreadsheet.getIndexesByPosition(position);
    const cell = tableObj.rows[row + 1].cells[column + 1];
    cell.childNodes[0].value = this.workbook.getProcessedValue(position, 0).value;
    this.workbook.spreadsheets[0].dependOn.get(position).forEach((pos) => {
      this.updateAllDependents(pos, tableObj);
    });
  }

  setWorkbook(workbook) {
    if (!(workbook instanceof Workbook)) {
      throw new TypeError('workbook must be a Workbook instance');
    }
    this.workbook = workbook;
  }
}
