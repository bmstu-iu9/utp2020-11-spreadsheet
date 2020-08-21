import WorkbookSerializer from './WorkbookSerializer.js';

export default class WorkbookIdSerializer {
  static serialize(workbookId) {
    const normallySerialized = WorkbookSerializer.serialize(workbookId.workbook);
    normallySerialized.id = workbookId.id;
    normallySerialized.lastCommitId = workbookId.lastCommitId;
    return normallySerialized;
  }
}
