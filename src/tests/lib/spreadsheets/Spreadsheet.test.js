import * as assert from 'assert';
import Spreadsheet from '../../../lib/spreadsheets/Spreadsheet.js';
import { Cell, valueTypes } from '../../../lib/spreadsheets/Cell.js';

const spreadsheetStandardName = 'spreadsheet';

describe('Spreadsheet', () => {
  describe('#constructor()', () => {
    it('should create an empty spreadsheet', () => {
      const spreadsheet = new Spreadsheet('test');
      assert.strictEqual(spreadsheet.name, 'test');
      assert.strictEqual(spreadsheet.cells.keys.length, 0);
    });
    it('should create a spreadsheet with A1=10', () => {
      const cells = new Map();
      cells.set('A1', new Cell(valueTypes.number, 10));
      const spreadsheet = new Spreadsheet('table', cells);
      assert.strictEqual(spreadsheet.name, 'table');
      assert.strictEqual(spreadsheet.cells, cells);
    });
    it('should throw an exception for wrong cells', () => {
      const cells = new Map();
      cells.set('A1', {});
      assert.throws(() => {
        new Spreadsheet(spreadsheetStandardName, cells);
      });
    });
    it('should throw an exception for integer name', () => {
      assert.throws(() => {
        new Spreadsheet(1);
      });
    });
  });
  describe('#setName()', () => {
    it('should set name to Bob', () => {
      const spreadsheet = new Spreadsheet(spreadsheetStandardName);
      spreadsheet.setName('Bob');
      assert.strictEqual(spreadsheet.name, 'Bob');
    });
    it('should throw an exception for integer argument', () => {
      const spreadsheet = new Spreadsheet(spreadsheetStandardName);
      assert.throws(() => {
        spreadsheet.setName(1);
      });
    });
  });
  describe('#isNameCorrect()', () => {
    it('should return true for name "a"', () => {
      assert.strictEqual(Spreadsheet.isNameCorrect('a'), true);
    });
    it('should return false for an empty name', () => {
      assert.strictEqual(Spreadsheet.isNameCorrect(''), false);
    });
    it('should return false for a name " \n "', () => {
      assert.strictEqual(Spreadsheet.isNameCorrect(' \n '), false);
    });
  });
  describe('#setCells()', () => {
    it('should set cells to B5=3, D3=false', () => {
      const spreadsheet = new Spreadsheet(spreadsheetStandardName);
      const cells = new Map();
      cells.set('B5', new Cell(valueTypes.number, 3));
      cells.set('D3', new Cell(valueTypes.boolean, false));
      spreadsheet.setCells(cells);
      assert.strictEqual(spreadsheet.cells, cells);
    });
    it('should throw an exception for integer key', () => {
      const cells = new Map();
      cells.set(1, new Cell());
      const spreadsheet = new Spreadsheet(spreadsheetStandardName);
      assert.throws(() => {
        spreadsheet.setCells(cells);
      });
    });
    it('should throw an exception for a non-map object', () => {
      const spreadsheet = new Spreadsheet(spreadsheetStandardName);
      assert.throws(() => {
        spreadsheet.setCells({});
      });
    });
  });
  describe('#getCell()', () => {
    it('should get an existing cell', () => {
      const spreadsheet = new Spreadsheet(spreadsheetStandardName);
      const cell = new Cell(valueTypes.boolean, true);
      spreadsheet.cells.set('A1', cell);
      assert.strictEqual(spreadsheet.getCell('A1'), cell);
    });
    it('should create an empty cell', () => {
      const spreadsheet = new Spreadsheet(spreadsheetStandardName);
      const cell = spreadsheet.getCell('A1');
      assert.strictEqual(cell.type, valueTypes.string);
    });
    it('should throw an exception for position 1A', () => {
      const spreadsheet = new Spreadsheet(spreadsheetStandardName);
      assert.throws(() => {
        spreadsheet.getCell('1A');
      });
    });
  });
  describe('#isPositionCorrect()', () => {
    it('should return true for B1', () => {
      assert.strictEqual(Spreadsheet.isPositionCorrect('B1'), true);
    });
    it('should return true for BAZ123', () => {
      assert.strictEqual(Spreadsheet.isPositionCorrect('BAZ123'), true);
    });
    it('should return false for A0', () => {
      assert.strictEqual(Spreadsheet.isPositionCorrect('A0'), false);
    });
    it('should return false for A5A', () => {
      assert.strictEqual(Spreadsheet.isPositionCorrect('A5A'), false);
    });
  });
});
