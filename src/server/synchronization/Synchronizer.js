import FormatError from '../../lib/errors/FormatError.js';
import Spreadsheet from '../../lib/spreadsheets/Spreadsheet.js';
import CommitFinder from './CommitFinder.js';

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

  addArrayLogs(commits, lastCommitId) {
    const lastPos = new CommitFinder(this.lastChanges).find(lastCommitId);
    if (this.lastChanges.length !== 0 && lastPos === -1) {
      throw new FormatError('invalid log ID');
    }
    const errAns = [];
    for (let i = 0; i < commits.length; i += 1) {
      for (let j = lastPos + 1; j < this.lastChanges.length; j += 1) {
        if (commits[i].cellAddress === this.lastChanges[j].cellAddress
          && commits[i].changeType === this.lastChanges[j].changeType) {
          errAns.push(this.lastChanges[j]);
        }
      }
      if (!setChangeType.has(commits[0].changeType)) {
        throw new FormatError(`invalid commit change type, find ${commits[i].changeType}`);
      }
    }
    if (errAns.length > 0) {
      return errAns;
    }
    commits.forEach((log) => {
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
