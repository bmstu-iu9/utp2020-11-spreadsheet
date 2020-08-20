import * as assert from 'assert';
import Workbook from '../../../lib/spreadsheets/Workbook.js';
import WorkbookId from '../../../lib/spreadsheets/WorkbookId.js';

describe('WorkbookId', () => {
  const id = 1;
  const lastCommitId = 'efe926c9-b247-4768-a185-9de4cfc58012';

  it('should be a child of Workbook', () => {
    const workbook = new WorkbookId(id, lastCommitId, 'test');
    assert.strictEqual(workbook instanceof Workbook, true);
  });
  describe('#constructor()', () => {
    it('should set ID and lastCommitId', () => {
      const workbook = new WorkbookId(id, lastCommitId, 'test');
      assert.strictEqual(workbook.id, id);
      assert.strictEqual(workbook.lastCommitId, lastCommitId);
    });
    it('should throw an exception for non-integer', () => {
      assert.throws(() => {
        new WorkbookId(1.23, lastCommitId, 'test');
      }, TypeError);
    });
    it('should throw an exception for non-uuid', () => {
      assert.throws(() => {
        new WorkbookId(id, `${lastCommitId}a`, 'test');
      });
    });
  });
});
