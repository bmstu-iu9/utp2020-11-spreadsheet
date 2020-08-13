import fs from 'fs';
import WorkbookSaver from './WorkbookSaver.js';
import WorkbookJsonDeserializer from '../../lib/serialization/WorkbookDeserializer.js';
import WorkbookPathGenerator from './WorkbookPathGenerator.js';

export default class WorkbookLoader {
  constructor(pathToWorkbooks) {
    this.setPathToWorkbooks(pathToWorkbooks);
  }

  load(workbookId) {
    const generator = new WorkbookPathGenerator(this.pathToWorkbooks);
    const path = generator.generate(workbookId);
    const serializedContent = JSON.parse(fs.readFileSync(path));
    return WorkbookJsonDeserializer.deserialize(serializedContent);
  }

  setPathToWorkbooks(pathToWorkbooks) {
    if (typeof pathToWorkbooks !== 'string') {
      throw new TypeError('pathToWorkbooks must be a string');
    }
    this.pathToWorkbooks = pathToWorkbooks;
  }
}
