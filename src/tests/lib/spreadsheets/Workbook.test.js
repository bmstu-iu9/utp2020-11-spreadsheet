import * as assert from 'assert';
import Workbook from '../../../lib/spreadsheets/Workbook.js';
import Spreadsheet from '../../../lib/spreadsheets/Spreadsheet.js';
import { Cell, valueTypes } from '../../../lib/spreadsheets/Cell.js';
import FormatError from '../../../lib/errors/FormatError.js';

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
      }, TypeError);
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
      }, FormatError);
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
      }, TypeError);
    });
    it('should throw an exception for an array with objects', () => {
      const workbook = new Workbook(workbookStandardName);
      assert.throws(() => {
        workbook.setSpreadsheets([{}, {}]);
      }, TypeError);
    });
  });
  describe('#getProcessedValue()', () => {
    it('should calculate formula from cell', () => {
      const workbook = new Workbook('book');
      workbook.createSpreadsheet('list');
      workbook.spreadsheets[0].setValueInCell('A1', valueTypes.number, 5);
      workbook.spreadsheets[0].setValueInCell('A2', valueTypes.formula, '=2*A1');
      workbook.spreadsheets[0].setValueInCell('A3', valueTypes.formula, '=A1+A2');
      workbook.spreadsheets[0].setValueInCell('A4', valueTypes.formula, '=A2-1');
      workbook.spreadsheets[0].setValueInCell('A5', valueTypes.formula, '=(1+5^(1/2))/2');
      assert.strictEqual(workbook.getProcessedValue('A1').value, 5);
      assert.strictEqual(workbook.getProcessedValue('A2').value, 10);
      assert.strictEqual(workbook.getProcessedValue('A3').value, 15);
      assert.strictEqual(workbook.getProcessedValue('A4').value, 9);
      assert.strictEqual(workbook.getProcessedValue('A5').value, (1 + Math.sqrt(5)) / 2);
    });
    it('should make cyclical calculations', () => {
      const workbook = new Workbook('book');
      workbook.createSpreadsheet('list');
      workbook.spreadsheets[0].setValueInCell('A1', valueTypes.formula, '=A2*A2');
      workbook.spreadsheets[0].setValueInCell('A2', valueTypes.formula, '=2*A1');
      workbook.spreadsheets[0].setValueInCell('A3', valueTypes.formula, '=5+A3');
      assert.throws(() => {
        workbook.getProcessedValue('A1');
      }, FormatError);
      assert.throws(() => {
        workbook.getProcessedValue('A2');
      }, FormatError);
      assert.throws(() => {
        workbook.getProcessedValue('A3');
      }, FormatError);
    });
    it('should take value from cell', () => {
      const cells = new Map();
      cells.set('A1', new Cell(valueTypes.number, 23456));
      const spreadsheet = new Spreadsheet('table', cells);
      const wb = new Workbook('book', [spreadsheet]);

      assert.strictEqual(wb.getProcessedValue('A1').value, 23456);
    });
  });
});
