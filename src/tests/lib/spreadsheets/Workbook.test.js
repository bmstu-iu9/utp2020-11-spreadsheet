import * as assert from 'assert';
import Workbook from '../../../lib/spreadsheets/Workbook.js';
import Spreadsheet from '../../../lib/spreadsheets/Spreadsheet.js';

describe('Workbook', () => {
  describe('#constructor()', () => {
    it('should create an empty workbook named "work"', () => {
      const workbook = new Workbook('work');
      assert.strictEqual(workbook.name, 'work');
      assert.strictEqual(workbook.spreadsheets.length, 0);
    });
    it('should set create a workbook with one spreadsheet', () => {
      const spreadsheets = [new Spreadsheet('')];
      const workbook = new Workbook('', spreadsheets);
      assert.strictEqual(workbook.spreadsheets, spreadsheets);
    });
    it('should throw an error for incorrect spreadsheets', () => {
      assert.throws(() => {
        new Workbook('', {});
      });
    });
  });
  describe('#setName()', () => {
    it('should set name to "Work"', () => {
      const workbook = new Workbook('');
      workbook.setName('Work');
      assert.strictEqual(workbook.name, 'Work');
    });
    it('should throw an exception for 20202 name', () => {
      const workbook = new Workbook('');
      assert.throws(() => {
        workbook.setName(20202);
      });
    });
  });
  describe('#createSpreadsheet()', () => {
    it('should create a spreadsheet named "Sheet"', () => {
      const workbook = new Workbook('');
      workbook.createSpreadsheet('Sheet');
      const spreadsheet = workbook.spreadsheets[0];
      assert.strictEqual(spreadsheet.name, 'Sheet');
    });
  });
  describe('#setSpreadsheets()', () => {
    it('should set spreadsheets to an array with one spreadsheet', () => {
      const workbook = new Workbook('');
      const spreadsheets = [new Spreadsheet('')];
      workbook.setSpreadsheets(spreadsheets);
      assert.strictEqual(workbook.spreadsheets, spreadsheets);
    });
    it('should throw an exception for a plain spreadsheet', () => {
      const workbook = new Workbook('');
      assert.throws(() => {
        workbook.setSpreadsheets(new Spreadsheet(''));
      });
    });
    it('should throw an exception for an array with objects', () => {
      const workbook = new Workbook('');
      assert.throws(() => {
        workbook.setSpreadsheets([{}, {}]);
      });
    });
  });
});
