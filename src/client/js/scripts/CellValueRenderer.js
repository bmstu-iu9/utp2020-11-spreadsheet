import Workbook from '../../../lib/spreadsheets/Workbook.js';
import { valueTypes } from '../../../lib/spreadsheets/Cell.js';
import Spreadsheet from '../../../lib/spreadsheets/Spreadsheet.js';

export default class CellValueRenderer {
  constructor(workbook) {
    this.setWorkbook(workbook);
    [this.cellInfo] = document.getElementsByClassName('cell-info');
  }

  activate(row, column, cell) {
    const position = Spreadsheet.getPositionByIndexes(row, column);
    this.cellInfo.value = this.workbook.spreadsheets[0].getCell(position).value;
    const cellToChange = cell;
    this.cellInfo.oninput = () => {
      const valueType = CellValueRenderer.getCellValueType(this.cellInfo.value);
      this.workbook.spreadsheets[0].setValueInCell(
        position, valueType.type, valueType.value,
      );
      cellToChange.childNodes[0].value = this.workbook.getProcessedValue(position).value;
    };
  }

  deactivate(cell) {
    const cellToChange = cell;
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

  setWorkbook(workbook) {
    if (!(workbook instanceof Workbook)) {
      throw new TypeError('workbook must be a Workbook instance');
    }
    this.workbook = workbook;
  }
}
