import readWorkbook from '../serialization/WorkbookDeserializer.js';
import saveWorkbook from '../serialization/WorkbookSerializer.js';
import FormatError from '../../lib/errors/FormatError.js';

const setChangeType = new Set(['color', 'value']);

export const zeroID = '00000000-0000-0000-0000-000000000000';

export class Synchronizer {
  constructor(nameWorkbook, pathToWorkbook, page, lastChanges = [{ ID: 0 }], maxLogSize = 10) {
    this.pathToWorkbook = pathToWorkbook;
    this.workbook = readWorkbook.readWorkbook(`${this.pathToWorkbook}/${nameWorkbook}.json`);
    this.page = page;
    this.lastChanges = lastChanges;
    this.maxLogSize = maxLogSize;
  }

  // в userID желательно записывать Math.random() и userID должен быть записан во все arrayLogs
  addArrayLogs(arrayLogs, userID) {
    let lastPos = -1;
    for (let i = this.lastChanges.length - 1; i >= 0; i -= 1) {
      if (userID === this.lastChanges[i].ID) {
        lastPos = i;
        break;
      }
    }
    if (this.lastChanges.length !== 0 && lastPos === -1) {
      throw new FormatError('invalid log ID');
    }
    const errAns = [];
    for (let i = 0; i < arrayLogs.length; i += 1) {
      for (let j = lastPos + 1; j < this.lastChanges.length; j += 1) {
        if (arrayLogs[i].cellAddress === this.lastChanges[j].cellAddress
          && arrayLogs[i].changeType === this.lastChanges[j].changeType) {
          errAns.push(this.lastChanges[j]);
        }
      }
      if (!setChangeType.has(arrayLogs[0].changeType)) {
        throw new FormatError(`invalid log change type, find ${arrayLogs[i].changeType}`);
      }
    }
    if (errAns.length > 0) {
      return errAns;
    }
    const spreadsheet = this.workbook.spreadsheets[this.page];
    arrayLogs.forEach((log) => {
      if (log.changeType === 'color') {
        const cell = spreadsheet.getCell(log.cellAddress);
        cell.setColor(log.color);
      } else {
        const cell = spreadsheet.getCell(log.cellAddress);
        cell.setValue(log.type, log.value);
      }
      this.lastChanges.push(log);
    });
    return true;
  }

  clearCheckChanges() {
    this.lastChanges = [{ ID: 0 }];
  }

  synchronize() {
    saveWorkbook.saveJson(this.workbook, `${this.pathToWorkbook}/../`);
  }
}
