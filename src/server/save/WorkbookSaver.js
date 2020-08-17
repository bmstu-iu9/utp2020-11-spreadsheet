import fs from 'fs';
import WorkbookSerializer from '../../lib/serialization/WorkbookSerializer.js';
import WorkbookPathManipulator from './WorkbookPathManipulator.js';

export default class WorkbookSaver extends WorkbookPathManipulator {
  save(workbook, workbookId) {
    const path = this.workbookPathGenerator.generate(workbookId);
    const serialized = WorkbookSerializer.serialize(workbook);
    const content = JSON.stringify(serialized);
    fs.writeFileSync(path, content);
  }
}
