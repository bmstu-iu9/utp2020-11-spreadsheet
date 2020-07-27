import readWorkbook from '../../lib/readWorkbook/JsonConverter.js';
import saveWorkbook from '../../lib/saveWorkbook/ClassConverter.js';

const setChangeType = new Set(['color', 'value']);

export default class Synchronizer {
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
      throw new TypeError('invalid log ID');
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
        throw new TypeError(`invalid log change type, find ${arrayLogs[i].changeType}`);
      }
    }
    if (errAns.length > 0) {
      return errAns;
    }
    arrayLogs.forEach((log) => {
      if (log.changeType === 'color') {
        const { cells } = this.workbook.spreadsheets[this.page];
        if (cells.get(log.cellAddress) === undefined) {
          cells.set(log.cellAddress, {});
        }
        cells.get(log.cellAddress).color = log.color;
      } else if (log.changeType === 'value') {
        const { cells } = this.workbook.spreadsheets[this.page];
        if (cells.get(log.cellAddress) === undefined) {
          cells.set(log.cellAddress, {});
        }
        cells.get(log.cellAddress).type = log.type;
        cells.get(log.cellAddress).value = log.value;
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