import * as assert from 'assert';
import WorkbookId from '../../../lib/spreadsheets/WorkbookId.js';
import WorkbookIdSerializer from '../../../lib/serialization/WorkbookIdSerializer.js';
import WorkbookIdDeserializer from '../../../lib/serialization/WorkbookIdDeserializer.js';
import Spreadsheet from '../../../lib/spreadsheets/Spreadsheet.js';
import Workbook from '../../../lib/spreadsheets/Workbook.js';

describe('WorkbookidDeserializer', () => {
  describe('#deserialize()', () => {
    it('should deserialize serialized data', () => {
      const name = 'name';
      const spreadsheets = [new Spreadsheet('name')];
      const workbook = new Workbook(name, spreadsheets);
      const id = 1;
      const lastCommitId = 'd4f573e1-26dd-4308-8655-99f31178ed0d';
      const expected = new WorkbookId(workbook, id, lastCommitId);
      const serialized = WorkbookIdSerializer.serialize(expected);
      const workbookId = WorkbookIdDeserializer.deserialize(serialized);
      assert.deepStrictEqual(workbookId, expected);
    });
  });
});
