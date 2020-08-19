import fs from 'fs';
import WorkbookDeserializer from '../../lib/serialization/WorkbookDeserializer.js';
import WorkbookPathManipulator from './WorkbookPathManipulator.js';

export default class WorkbookLoader extends WorkbookPathManipulator {
  load(workbookId) {
    const path = this.workbookPathGenerator.generate(workbookId);
    const serializedContent = JSON.parse(fs.readFileSync(path));
    return WorkbookDeserializer.deserialize(serializedContent);
  }
}
