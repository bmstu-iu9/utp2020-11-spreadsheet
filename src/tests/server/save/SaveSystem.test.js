import * as assert from 'assert';
import SaveSystem from '../../../server/save/SaveSystem.js';
import WorkbookLoader from '../../../server/save/WorkbookLoader.js';
import WorkbookSaver from '../../../server/save/WorkbookSaver.js';
import CommitLoader from '../../../server/save/CommitLoader.js';
import CommitSaver from '../../../server/save/CommitSaver.js';
import WorkbookPathGenerator from '../../../server/save/WorkbookPathGenerator.js';
import CommitPathGenerator from '../../../server/save/CommitPathGenerator.js';

describe('SaveSystem', () => {
  describe('#constructor()', () => {
    it('should create correct fields', () => {
      const pathToWorkbooks = 'workbooks';
      const pathToCommits = 'commits';
      const system = new SaveSystem(pathToWorkbooks, pathToCommits);
      assert.strictEqual(system.workbookPathGenerator instanceof WorkbookPathGenerator, true);
      assert.strictEqual(system.workbookLoader instanceof WorkbookLoader, true);
      assert.strictEqual(system.workbookSaver instanceof WorkbookSaver, true);
      assert.strictEqual(system.commitPathGenerator instanceof CommitPathGenerator, true);
      assert.strictEqual(system.commitLoader instanceof CommitLoader, true);
      assert.strictEqual(system.commitSaver instanceof CommitSaver, true);
    });
  });
});
