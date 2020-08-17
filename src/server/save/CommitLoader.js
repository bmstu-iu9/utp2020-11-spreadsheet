import fs from 'fs';
import CommitPathManipulator from './CommitPathManipulator.js';

export default class CommitLoader extends CommitPathManipulator {
  load(workbookId) {
    if (!Number.isInteger(workbookId)) {
      throw new TypeError('workbookId must be an integer');
    }
    const path = this.commitPathGenerator.generate(workbookId);
    const content = fs.readFileSync(path);
    return JSON.parse(content);
  }
}
