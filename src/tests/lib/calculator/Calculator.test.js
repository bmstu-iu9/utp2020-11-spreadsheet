import * as assert from 'assert';
import Calculator from '../../../lib/calculator/Calculator.js';
import Workbook from '../../../lib/spreadsheets/Workbook.js';
import Spreadsheet from '../../../lib/spreadsheets/Spreadsheet.js';
import { Cell, valueTypes } from '../../../lib/spreadsheets/Cell.js';
import NumberType from '../../../lib/typevalue/NumberType.js';

const book = new Workbook('book');
describe('Calculator', () => {
  describe('#constructor()', () => {
    it('should make new element', () => {
      const calculator = new Calculator(book);
      assert.deepStrictEqual(calculator.book, book);
    });
  });
  describe('#calculate()', () => {
    it('should calculate value in cell', () => {
      const cells = new Map();
      cells.set('A1', new Cell(valueTypes.formula, '=(1+5^(1/2))/2'));
      const spreadsheet = new Spreadsheet('table', cells);
      const wb = new Workbook('book', [spreadsheet]);
      assert.deepStrictEqual(new Calculator(wb).calculate('A1', 0), new NumberType((1 + Math.sqrt(5)) / 2));
    });
  });
});
