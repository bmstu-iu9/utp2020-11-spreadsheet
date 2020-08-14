import * as assert from 'assert';
import mock from 'mock-fs';
import WorkbookLoader from '../../../server/save/WorkbookLoader.js';
import WorkbookPathGenerator from '../../../server/save/WorkbookPathGenerator.js';
import Workbook from '../../../lib/spreadsheets/Workbook.js';

describe('WorkbookLoader', () => {
  describe('#constructor()', () => {
    it('should create object with correct fields', () => {
      const pathGenerator = new WorkbookPathGenerator('./workbooks');
      const loader = new WorkbookLoader(pathGenerator);
      assert.strictEqual(loader.workbookPathGenerator, pathGenerator);
    });
    it('should throw an exception for non-path generator', () => {
      assert.throws(() => {
        new WorkbookLoader({});
      }, TypeError);
    });
  });
  describe('#load', () => {
    it('should load a workbook by id', () => {
      mock({
        '1.json': '{"name":"test","spreadsheets":[]}',
      });
      const pathGenerator = new WorkbookPathGenerator('.');
      const loader = new WorkbookLoader(pathGenerator);
      const testWorkbook = loader.load(1);
      assert.strictEqual(testWorkbook.name, 'test');
      mock.restore();
    });
  });
});
