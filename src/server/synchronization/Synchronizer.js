import FormatError from '../../lib/errors/FormatError.js';
import Workbook from '../../lib/spreadsheets/Workbook.js';
import CommitFinder from './CommitFinder.js';

const setChangeType = new Set(['color', 'value']);

export const zeroID = '00000000-0000-0000-0000-000000000000';

export class Synchronizer {
  constructor(workbook, acceptedCommits = [{ ID: zeroID }]) {
    this.setWorkbook(workbook);
    this.setAcceptedCommits(acceptedCommits);
  }

  setAcceptedCommits(acceptedCommits) {
    if (!(acceptedCommits instanceof Array)) {
      throw new TypeError('acceptedCommits must be an array');
    }
    this.acceptedCommits = acceptedCommits;
  }

  setWorkbook(workbook) {
    if (!(workbook instanceof Workbook)) {
      throw new TypeError('spreadsheet must be a Workbook instance');
    }
    this.workbook = workbook;
  }

  addCommits(commits, lastCommitId) {
    const lastPos = new CommitFinder(this.acceptedCommits).find(lastCommitId);
    if (this.acceptedCommits.length !== 0 && lastPos === -1) {
      throw new FormatError('invalid log ID');
    }
    commits.forEach((commit) => {
      Synchronizer.validateCommit(commit);
    });
    const conflictingCommits = this.findConflictingCommits(commits, lastPos);
    if (conflictingCommits.length > 0) {
      return conflictingCommits;
    }
    commits.forEach((commit) => {
      const cell = this.workbook.spreadsheets[commit.page].getCell(commit.cellAddress);
      this.applyCommitToCell(commit, cell);
    });
    return [];
  }

  findConflictingCommits(commits, lastPos) {
    const conflictingCommits = [];
    commits.forEach((commit) => {
      for (let j = lastPos + 1; j < this.acceptedCommits.length; j += 1) {
        if (Synchronizer.areCommitsConflicting(commit, this.acceptedCommits[j])) {
          conflictingCommits.push(this.acceptedCommits[j]);
        }
      }
    });
    return conflictingCommits;
  }

  static validateCommit(commit) {
    if (!setChangeType.has(commit.changeType)) {
      throw new FormatError(`invalid commit change type: ${commit.changeType}`);
    }
  }

  applyCommitToCell(commit, cell) {
    if (commit.changeType === 'color') {
      cell.setColor(commit.color);
    } else {
      cell.setValue(commit.type, commit.value);
    }
    this.acceptedCommits.push(commit);
  }

  static areCommitsConflicting(first, second) {
    return first.page === second.page
          && first.cellAddress === second.cellAddress
          && first.changeType === second.changeType;
  }
}
