import * as assert from 'assert';
import fs from 'fs';
import mock from 'mock-fs';
import Workbook from '../../../lib/spreadsheets/Workbook.js';
import WorkbookSaver from '../../../server/save/WorkbookSaver.js';
import WorkbookDeserializer from '../../../lib/serialization/WorkbookDeserializer.js';
import WorkbookPathGenerator from '../../../server/save/WorkbookPathGenerator.js';

const pathGenerator = new WorkbookPathGenerator('.');

describe('WorkbookSaver', () => {
  describe('#constructor()', () => {
    it('should create object with correct fields', () => {
      const saver = new WorkbookSaver(pathGenerator);
      assert.strictEqual(saver.workbookPathGenerator, pathGenerator);
    });
    it('should throw an exception for non-path generator', () => {
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
      const saver = new WorkbookSaver(pathGenerator);
      saver.save(1, workbook);
      const content = fs.readFileSync('./1.json');
      const testWorkbook = WorkbookDeserializer.deserialize(JSON.parse(content));
      assert.deepStrictEqual(testWorkbook, workbook);
      mock.restore();
    });
  });
});
