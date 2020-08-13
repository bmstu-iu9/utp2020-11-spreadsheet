import fs from 'fs';
import WorkbookPathGenerator from './WorkbookPathGenerator.js';
import WorkbookJsonSerializer from '../../lib/serialization/WorkbookSerializer.js';

export default class WorkbookSaver {
  constructor(pathToWorkbooks) {
    this.setPathToWorkbooks(pathToWorkbooks);
  }

  setPathToWorkbooks(pathToWorkbooks) {
    if (typeof pathToWorkbooks !== 'string') {
      throw new TypeError('pathToWorkbooks must be a string');
    }
    this.pathToWorkbooks = pathToWorkbooks;
  }

  save(workbook, workbookId) {
    const generator = new WorkbookPathGenerator(this.pathToWorkbooks);
    const path = generator.generate(workbookId);
    const serialized = WorkbookJsonSerializer.serialize(workbook);
    const content = JSON.stringify(serialized);
    fs.writeFileSync(path, content);
  }
}
