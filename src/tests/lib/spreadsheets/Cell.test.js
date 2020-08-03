import * as assert from 'assert';
import { Cell, defaultCellColor, valueTypes } from '../../../lib/spreadsheets/Cell.js';

describe('Cell', () => {
  describe('#constructor()', () => {
    it('should create an empty cell', () => {
      const cell = new Cell();
      assert.strictEqual(cell.type, valueTypes.string);
      assert.strictEqual(cell.value, '');
      assert.strictEqual(cell.color, defaultCellColor);
    });
    it('should create a cell with number', () => {
      const cell = new Cell(valueTypes.number, 10);
      assert.strictEqual(cell.type, valueTypes.number);
      assert.strictEqual(cell.value, 10);
    });
    it('should throw an exception for 2 as boolean', () => {
      assert.throws(() => {
        new Cell(valueTypes.boolean, 2);
      }, (err) => {
        assert.strictEqual(err.name, 'TypeError');
        return true;
      });
    });
  });
  describe('#setValue()', () => {
    it('should set value to false', () => {
      const cell = new Cell();
      cell.setValue(valueTypes.boolean, false);
      assert.strictEqual(cell.value, false);
    });
    it('should throw an exception for false as formula', () => {
      const cell = new Cell();
      assert.throws(() => {
        cell.setValue('formula', false);
      }, (err) => {
        assert.strictEqual(err.name, 'TypeError');
        return true;
      });
    });
  });
  describe('#setColor()', () => {
    it('should set color to #123456', () => {
      const cell = new Cell();
      cell.setColor('#123456');
      assert.strictEqual(cell.color, '#123456');
    });
    it('should throw an exception for #zzzzzz', () => {
      const cell = new Cell();
      assert.throws(() => {
        cell.setColor('#zzzzzz');
      }, (err) => {
        assert.strictEqual(err.name, 'FormatError');
        return true;
      });
    });
  });
  describe('#isColorCorrect()', () => {
    it('should return true for #ab24ef', () => {
      assert.strictEqual(Cell.isColorCorrect('#ab24ef'), true);
    });
    it('should return false for #123', () => {
      assert.strictEqual(Cell.isColorCorrect('#123'), false);
    });
  });
  describe('#isValueCorrect()', () => {
    it('should return false for Infinity as number', () => {
      assert.strictEqual(Cell.isValueCorrect(valueTypes.number, Infinity), false);
    });
    it('should return false for NaN as number', () => {
      assert.strictEqual(Cell.isValueCorrect(valueTypes.number, NaN), false);
    });
    it('should return true for "test" as string', () => {
      assert.strictEqual(Cell.isValueCorrect(valueTypes.string, 'test'), true);
    });
  });
  describe('#getRequiredTypeString()', () => {
    it('should return "string" for formula type', () => {
      assert.strictEqual(Cell.getRequiredTypeString(valueTypes.formula), 'string');
    });
  });
  describe('#getDefaultValue()', () => {
    it('should return "" for formula cell', () => {
      const value = Cell.getDefaultValue(valueTypes.formula);
      assert.strictEqual(value, '');
    });
    it('should throw an exception for type "wrong"', () => {
      assert.throws(() => {
        Cell.getDefaultValue('wrong');
      }, (err) => {
        assert.strictEqual(err.name, 'FormatError');
        return true;
      });
    });
  });
});
