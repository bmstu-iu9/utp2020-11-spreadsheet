import * as assert from 'assert';
import mock from 'mock-fs';
import WorkbookLoader from '../../../server/save/WorkbookLoader.js';

describe('WorkbookLoader', () => {
  describe('#constructor()', () => {
    it('should create object with correct fields', () => {
      const pathToWorkbooks = './workbooks';
      const loader = new WorkbookLoader(pathToWorkbooks);
      assert.strictEqual(loader.pathToWorkbooks, pathToWorkbooks);
    });
    it('should throw an exception for non-string', () => {
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
      const loader = new WorkbookLoader('./');
      const testWorkbook = loader.load(1);
      assert.strictEqual(testWorkbook.name, 'test');
      mock.restore();
    });
  });
});
