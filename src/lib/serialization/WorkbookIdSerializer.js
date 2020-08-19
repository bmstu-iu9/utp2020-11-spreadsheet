import WorkbookSerializer from './WorkbookSerializer.js';

export default class WorkbookIdSerializer {
  static serialize(workbook, id, lastCommitId) {
    const normallySerialized = WorkbookSerializer.serialize(workbook);
    normallySerialized.id = id;
    normallySerialized.lastCommitId = lastCommitId;
    return normallySerialized;
  }
}
