import fs from 'fs';

export default class Synchronizer {
  constructor(pathToWorkbook, page) {
    this.pathToWorkbook = pathToWorkbook;
    this.jsonWorkbook = JSON.parse(fs.readFileSync(pathToWorkbook));
    this.page = page;
    this.lastChanges = new Map();
    this.IDlogs = 0;
  }

  addArrayLogs(arrayLogs) {
    this.IDlogs += 1;
    arrayLogs.forEach((log) => {
      switch (log.type) {
        case 'color': {
          const { cells } = this.jsonWorkbook.sheets[this.page];
          if (cells[log.cellAddress] === undefined) {
            cells[log.cellAddress] = {};
          }
          cells[log.cellAddress].color = log.color;
          break;
        }
        case 'value': {
          const { cells } = this.jsonWorkbook.sheets[this.page];
          if (cells[log.cellAddress] === undefined) {
            cells[log.cellAddress] = {};
          }
          cells[log.cellAddress].type = log.valueType;
          cells[log.cellAddress].value = log.value;
          break;
        }
        default:
          throw new TypeError('undefined log change type');
      }
    });
    const last = arrayLogs[arrayLogs.length - 1];
    const inMap = this.lastChanges.get(`${last.cellAddress}/${last.type}`);
    const ans = (inMap !== undefined) ? { first: inMap, second: last } : undefined;
    // при коллизия изменений - изменение также применяется, но начинает возвращать пару
    this.lastChanges.set(`${last.cellAddress}/${last.type}`, last);
    return ans;
  }

  clearCheckChanges() {
    this.lastChanges = new Map();
  }

  synchronize() {
    fs.writeFileSync(this.pathToWorkbook, JSON.stringify(this.jsonWorkbook));
  }
}
