import Workbook from '../../../lib/spreadsheets/Workbook.js';
import { valueTypes } from '../../../lib/spreadsheets/Cell.js';
import Spreadsheet from '../../../lib/spreadsheets/Spreadsheet.js';

export default class CellValueRenderer {
  constructor(workbook) {
    this.setWorkbook(workbook);
    [this.cellInfo] = document.getElementsByClassName('cell-info');
  }

  activate(tableObj, row, column) {
    const position = Spreadsheet.getPositionByIndexes(row, column);
    const cell = tableObj.rows[row + 1].cells[column + 1];
    const initialValueString = this.workbook.spreadsheets[0].getCell(position).value;
    cell.childNodes[0].value = initialValueString;
    this.syncWithCellInfo(tableObj, row, column, cell);
    cell.oninput = () => {
      const valueString = cell.childNodes[0].value;
      this.cellInfo.value = valueString;
      const valueType = CellValueRenderer.getCellValueType(valueString);
      this.workbook.spreadsheets[0].setValueInCell(
        position, valueType.type, valueType.value,
      );
    };
  }

  syncWithCellInfo(tableObj, row, column) {
    const position = Spreadsheet.getPositionByIndexes(row, column);
    const initialValueString = this.workbook.spreadsheets[0].getCell(position).value;
    this.cellInfo.value = initialValueString;
    this.cellInfo.oninput = () => {
      const valueType = CellValueRenderer.getCellValueType(this.cellInfo.value);
      try {
        this.workbook.spreadsheets[0].setValueInCell(
          position, valueType.type, valueType.value,
        );
      } catch {
        // Should not do anything in case of exception
      }
      this.updateAllDependents(tableObj, position);
    };
  }

  deactivate(tableObj, row, column) {
    const position = Spreadsheet.getPositionByIndexes(row, column);
    this.updateAllDependents(tableObj, position);
    const cell = tableObj.rows[row + 1].cells[column + 1];
    cell.oninput = null;
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

  updateAllDependents(tableObj, position) {
    const [row, column] = Spreadsheet.getIndexesByPosition(position);
    const cell = tableObj.rows[row + 1].cells[column + 1];
    try {
      cell.childNodes[0].value = this.workbook.getProcessedValue(position).value;
    } catch (err) {
      cell.childNodes[0].value = 'Ошибка';
    }
    this.workbook.spreadsheets[0].dependOn.get(position).forEach((pos) => {
      this.updateAllDependents(tableObj, pos);
    });
  }

  setWorkbook(workbook) {
    if (!(workbook instanceof Workbook)) {
      throw new TypeError('workbook must be a Workbook instance');
    }
    this.workbook = workbook;
  }
}
