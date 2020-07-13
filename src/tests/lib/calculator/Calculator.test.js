import * as assert from 'assert';
import Calculator from '../../../lib/calculator/Calculator.js';
import Workbook from '../../../lib/spreadsheets/Workbook.js';
import Spreadsheet from '../../../lib/spreadsheets/Spreadsheet.js';
import { Cell, valueTypes } from '../../../lib/spreadsheets/Cell.js';

describe('Calculator', () => {
  describe('#constructor()', () => {
    it('should make new element', () => {
      assert.deepEqual(new Calculator(new Workbook('book')), { book: new Workbook('book') });
      assert.deepEqual(new Calculator(new Workbook('fdsfdg')), { book: new Workbook('fdsfdg') });
      assert.deepEqual(new Calculator(new Workbook('2635fg')), { book: new Workbook('2635fg') });
    });
  });
  describe('#calculate()', () => {
    it('should calculate value in cell', () => {
      const cells = new Map();
      cells.set('A1', new Cell(valueTypes.formula, '=(1+5^(1/2))/2'));
      const spreadsheet = new Spreadsheet('table', cells);
      const wb = new Workbook('book', [spreadsheet]);

      assert.deepEqual(new Calculator(wb).calculate('A1', 0), { value: (1 + Math.sqrt(5)) / 2 });
    });
  });
});
