import WorkbookDeserializer from './WorkbookDeserializer.js';
import WorkbookId from '../spreadsheets/WorkbookId.js';

export default class WorkbookIdDeserializer {
  static deserialize(serializedWorkbookId) {
    const workbook = WorkbookDeserializer.deserialize(serializedWorkbookId);
    return new WorkbookId(
      workbook,
      serializedWorkbookId.id,
      serializedWorkbookId.lastCommitId,
    );
  }
}
