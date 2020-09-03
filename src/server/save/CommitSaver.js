import fs from 'fs';
import CommitPathManipulator from './CommitPathManipulator.js';

export default class CommitSaver extends CommitPathManipulator {
  save(workbookId, commits) {
    if (!Number.isInteger(workbookId)) {
      throw new TypeError('workbookid must be an integer');
    }
    if (!(commits instanceof Array)) {
      throw new TypeError('commits must be an array');
    }
    const path = this.commitPathGenerator.generate(workbookId);
    const serialized = JSON.stringify(commits);
    fs.writeFileSync(path, serialized);
  }
}
