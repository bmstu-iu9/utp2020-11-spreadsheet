import * as assert from 'assert';
import Workbook from '../../../lib/spreadsheets/Workbook.js';
import Spreadsheet from '../../../lib/spreadsheets/Spreadsheet.js';
import { Cell, valueTypes } from '../../../lib/spreadsheets/Cell.js';

const workbookStandardName = 'workbook';
const spreadsheetStandardName = 'spreadsheet';

describe('Workbook', () => {
  describe('#constructor()', () => {
    it('should create an empty workbook named "work"', () => {
      const workbook = new Workbook('work');
      assert.strictEqual(workbook.name, 'work');
      assert.strictEqual(workbook.spreadsheets.length, 0);
    });
    it('should set create a workbook with one spreadsheet', () => {
      const spreadsheets = [new Spreadsheet(spreadsheetStandardName)];
      const workbook = new Workbook(workbookStandardName, spreadsheets);
      assert.strictEqual(workbook.spreadsheets, spreadsheets);
    });
    it('should throw an error for incorrect spreadsheets', () => {
      assert.throws(() => {
        new Workbook(workbookStandardName, {});
      });
    });
  });
  describe('#setName()', () => {
    it('should set name to "Work"', () => {
      const workbook = new Workbook(workbookStandardName);
      workbook.setName('Work');
      assert.strictEqual(workbook.name, 'Work');
    });
    it('should throw an exception for 20202 name', () => {
      const workbook = new Workbook(workbookStandardName);
      assert.throws(() => {
        workbook.setName(20202);
      });
    });
  });
  describe('#isNameCorrect()', () => {
    it('should return true for name "a"', () => {
      assert.strictEqual(Workbook.isNameCorrect('a'), true);
    });
    it('should return false for an empty name', () => {
      assert.strictEqual(Workbook.isNameCorrect(''), false);
    });
    it('should return false for a name " \\n "', () => {
      assert.strictEqual(Workbook.isNameCorrect(' \n '), false);
    });
  });
  describe('#createSpreadsheet()', () => {
    it('should create a spreadsheet named "Sheet"', () => {
      const workbook = new Workbook(workbookStandardName);
      workbook.createSpreadsheet('Sheet');
      const spreadsheet = workbook.spreadsheets[0];
      assert.strictEqual(spreadsheet.name, 'Sheet');
    });
  });
  describe('#setSpreadsheets()', () => {
    it('should set spreadsheets to an array with one spreadsheet', () => {
      const workbook = new Workbook(workbookStandardName);
      const spreadsheets = [new Spreadsheet(spreadsheetStandardName)];
      workbook.setSpreadsheets(spreadsheets);
      assert.strictEqual(workbook.spreadsheets, spreadsheets);
    });
    it('should throw an exception for a plain spreadsheet', () => {
      const workbook = new Workbook(workbookStandardName);
      assert.throws(() => {
        workbook.setSpreadsheets(new Spreadsheet(spreadsheetStandardName));
      });
    });
    it('should throw an exception for an array with objects', () => {
      const workbook = new Workbook(workbookStandardName);
      assert.throws(() => {
        workbook.setSpreadsheets([{}, {}]);
      });
    });
  });
  describe('#getProcessedValue()', () => {
    it('should calculate formula from cell', () => {
      const cells = new Map();
      cells.set('A1', new Cell(valueTypes.formula, '=(1+5^(1/2))/2'));
      const spreadsheet = new Spreadsheet('table', cells);
      const wb = new Workbook('book', [spreadsheet]);

      assert.deepEqual(wb.getProcessedValue('A1'), (1 + Math.sqrt(5)) / 2);
    });
    it('should take value from cell', () => {
      const cells = new Map();
      cells.set('A1', new Cell(valueTypes.number, 23456));
      const spreadsheet = new Spreadsheet('table', cells);
      const wb = new Workbook('book', [spreadsheet]);

      assert.deepEqual(wb.getProcessedValue('A1'), 23456);
    });
  });
});
