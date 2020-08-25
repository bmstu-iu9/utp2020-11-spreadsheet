import * as assert from 'assert';
import Workbook from '../../../lib/spreadsheets/Workbook.js';
import WorkbookId from '../../../lib/spreadsheets/WorkbookId.js';

describe('WorkbookId', () => {
  const id = 1;
  const lastCommitId = 'efe926c9-b247-4768-a185-9de4cfc58012';
  const workbook = new Workbook('test');

  describe('#constructor()', () => {
    it('should set ID and lastCommitId', () => {
      const workbookId = new WorkbookId(workbook, id, lastCommitId);
      assert.strictEqual(workbookId.workbook, workbook);
      assert.strictEqual(workbookId.id, id);
      assert.strictEqual(workbookId.lastCommitId, lastCommitId);
    });
    it('should throw an exception for non-Workbook', () => {
      assert.throws(() => {
        new WorkbookId({}, id, lastCommitId);
      }, TypeError);
    });
    it('should throw an exception for non-integer', () => {
      assert.throws(() => {
        new WorkbookId(workbook, 1.23, lastCommitId);
      }, TypeError);
    });
    it('should throw an exception for non-uuid', () => {
      assert.throws(() => {
        new WorkbookId(workbook, id, `${lastCommitId}a`);
      });
    });
  });
});
