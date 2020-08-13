import * as assert from 'assert';
import fs from 'fs';
import mock from 'mock-fs';
import Workbook from '../../../lib/spreadsheets/Workbook.js';
import WorkbookSaver from '../../../server/save/WorkbookSaver.js';
import WorkbookJsonDeserializer from '../../../lib/serialization/WorkbookDeserializer.js';

const pathToWorkbooks = './';

describe('WorkbookSaver', () => {
  describe('#constructor()', () => {
    it('should create object with correct fields', () => {
      const saver = new WorkbookSaver(pathToWorkbooks);
      assert.strictEqual(saver.pathToWorkbooks, pathToWorkbooks);
    });
    it('should throw an exception for non-string path', () => {
      assert.throws(() => {
        new WorkbookSaver(5);
      }, TypeError);
    });
  });
  describe('#save()', () => {
    it('should save workbook to a file', () => {
      mock({
        './': {},
      });
      const workbook = new Workbook('test');
      const saver = new WorkbookSaver('./');
      saver.save(workbook, 1);
      const content = fs.readFileSync('./1.json');
      const testWorkbook = WorkbookJsonDeserializer.deserialize(JSON.parse(content));
      assert.deepStrictEqual(testWorkbook, workbook);
      mock.restore();
    });
  });
});
