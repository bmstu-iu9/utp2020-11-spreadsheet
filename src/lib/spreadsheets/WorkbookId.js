import Workbook from './Workbook.js';
import UuidValidator from '../uuid/UuidValidator.js';

export default class WorkbookId extends Workbook {
  constructor(id, lastCommitId, ...params) {
    super(...params);
    this.setId(id);
    this.setLastCommitId(lastCommitId);
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
