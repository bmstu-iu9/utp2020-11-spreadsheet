import FormatError from '../../lib/errors/FormatError.js';
import Spreadsheet from '../../lib/spreadsheets/Spreadsheet.js';

const setChangeType = new Set(['color', 'value']);

export const zeroID = '00000000-0000-0000-0000-000000000000';

export class Synchronizer {
  constructor(spreadsheet, lastChanges = [{ ID: zeroID }], maxLogSize = 10) {
    this.setSpreadsheet(spreadsheet);
    this.setLastChanges(lastChanges);
    this.setMaxLogSize(maxLogSize);
  }

  setMaxLogSize(maxLogSize) {
    if (!Number.isInteger(maxLogSize)) {
      throw new TypeError('maxLogSize must be an integer');
    }
    this.maxLogSize = maxLogSize;
  }

  setLastChanges(lastChanges) {
    if (!(lastChanges instanceof Array)) {
      throw new TypeError('lastChanges must be an array');
    }
    this.lastChanges = lastChanges;
  }

  setSpreadsheet(spreadsheet) {
    if (!(spreadsheet instanceof Spreadsheet)) {
      throw new TypeError('spreadsheet must be a Spreadsheet instance');
    }
    this.spreadsheet = spreadsheet;
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
    arrayLogs.forEach((log) => {
      if (log.changeType === 'color') {
        const cell = this.spreadsheet.getCell(log.cellAddress);
        cell.setColor(log.color);
      } else {
        const cell = this.spreadsheet.getCell(log.cellAddress);
        cell.setValue(log.type, log.value);
      }
      this.lastChanges.push(log);
    });
    return true;
  }
}
