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
    this.cellInfo.value = cell.childNodes[0].value;
    const cellToChange = cell;
    this.cellInfo.oninput = () => {
      cellToChange.childNodes[0].value = this.cellInfo.value;
      this.workbook.spreadsheets[0].setValueInCell(
        position, valueTypes.string, this.cellInfo.value,
      );
    };
    cellToChange.oninput = () => {
      this.cellInfo.value = cell.childNodes[0].value;
      this.workbook.spreadsheets[0].setValueInCell(
        position, valueTypes.string, this.cellInfo.value,
      );
    };
  }

  deactivate(cell) {
    const cellToChange = cell;
    cellToChange.oninput = null;
    this.cellInfo.oninput = null;
    this.cellInfo.value = '';
  }

  setWorkbook(workbook) {
    if (!(workbook instanceof Workbook)) {
      throw new TypeError('workbook must be a Workbook instance');
    }
    this.workbook = workbook;
  }
}
