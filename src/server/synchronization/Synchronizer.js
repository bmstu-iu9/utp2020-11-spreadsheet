import FormatError from '../../lib/errors/FormatError.js';
import Workbook from '../../lib/spreadsheets/Workbook.js';
import CommitFinder from './CommitFinder.js';

const setChangeType = new Set(['color', 'value']);

export const zeroID = '00000000-0000-0000-0000-000000000000';

export class Synchronizer {
  constructor(workbook, lastChanges = [{ ID: zeroID }], maxLogSize = 10) {
    this.setWorkbook(workbook);
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

  setWorkbook(workbook) {
    if (!(workbook instanceof Workbook)) {
      throw new TypeError('spreadsheet must be a Workbook instance');
    }
    this.workbook = workbook;
  }

  addArrayLogs(commits, lastCommitId) {
    const lastPos = new CommitFinder(this.lastChanges).find(lastCommitId);
    if (this.lastChanges.length !== 0 && lastPos === -1) {
      throw new FormatError('invalid log ID');
    }
    const errAns = [];
    for (let i = 0; i < commits.length; i += 1) {
      for (let j = lastPos + 1; j < this.lastChanges.length; j += 1) {
        if (Synchronizer.doCommitsConflict(commits[i], this.lastChanges[j])) {
          errAns.push(this.lastChanges[j]);
        }
      }
      if (!setChangeType.has(commits[i].changeType)) {
        throw new FormatError(`invalid commit change type, find ${commits[i].changeType}`);
      }
    }
    if (errAns.length > 0) {
      return errAns;
    }
    commits.forEach((log) => {
      const cell = this.workbook.spreadsheets[log.page].getCell(log.cellAddress);
      this.applyCommitToCell(log, cell);
    });
    return true;
  }

  applyCommitToCell(commit, cell) {
    if (commit.changeType === 'color') {
      cell.setColor(commit.color);
    }
    else {
      cell.setValue(commit.type, commit.value);
    }
    this.lastChanges.push(commit);
  }

  static doCommitsConflict(first, second) {
    return first.cellAddress === second.cellAddress
          && first.changeType === second.changeType;
  }
}
