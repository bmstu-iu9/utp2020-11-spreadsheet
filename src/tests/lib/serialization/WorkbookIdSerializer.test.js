import * as assert from 'assert';
import Workbook from '../../../lib/spreadsheets/Workbook.js';
import WorkbookSerializer from '../../../lib/serialization/WorkbookSerializer.js';
import WorkbookIdSerialzier from '../../../lib/serialization/WorkbookIdSerializer.js';

describe('WorkbookIdSerialzier', () => {
  describe('#serialize()', () => {
    it('should serialize and set id and workbookId', () => {
      const workbook = new Workbook('test');
      const normallySerialized = WorkbookSerializer.serialize(workbook);
      const id = 228;
      normallySerialized.id = 228;
      const lastCommitId = 'ad0d0058-babd-4e75-ad24-7a8d0ed4cbd3';
      normallySerialized.lastCommitId = lastCommitId;
      const serialized = WorkbookIdSerialzier.serialize(workbook, id, lastCommitId);
      assert.deepStrictEqual(serialized, normallySerialized);
    });
  });
});
