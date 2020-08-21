import Workbook from './Workbook.js';
import UuidValidator from '../uuid/UuidValidator.js';

export default class WorkbookId {
  constructor(workbook, id, lastCommitId) {
    this.setWorkbook(workbook);
    this.setId(id);
    this.setLastCommitId(lastCommitId);
  }

  setWorkbook(workbook) {
    if (!(workbook instanceof Workbook)) {
      throw new TypeError('workbook must be a Workbook instance');
    }
    this.workbook = workbook;
  }

  setLastCommitId(lastCommitId) {
    if (!UuidValidator.isUuidValid(lastCommitId)) {
      throw new TypeError('lastCommitId must be a valid UUID');
    }
    this.lastCommitId = lastCommitId;
  }

  setId(id) {
    if (!Number.isInteger(id)) {
      throw new TypeError('id must be an integer');
    }
    this.id = id;
  }
}
