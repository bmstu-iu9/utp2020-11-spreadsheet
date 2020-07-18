import * as assert from 'assert';
import StringValueFilter from '../../../lib/filters/StringValueFilter.js';
import { Cell, valueTypes } from '../../../lib/spreadsheets/Cell.js';

describe('StringValueFilter', () => {
  describe('#constructor()', () => {
    it('should not throw an exception for "Hello"', () => {
      assert.doesNotThrow(() => {
        new StringValueFilter('A', ['Hello']);
      });
    });
  });
  describe('#setValue()', () => {
    it('should not throw an exception for "Test"', () => {
      const stringValueFilter = new StringValueFilter('A');
      assert.doesNotThrow(() => {
        stringValueFilter.setValues(['Test']);
      });
    });
    it('should throw an exception for true', () => {
      const stringValueFilter = new StringValueFilter('A');
      assert.throws(() => {
        stringValueFilter.setValues(true);
      });
    });
    it('should throw an exception for [true]', () => {
      const stringValueFilter = new StringValueFilter('A');
      assert.throws(() => {
        stringValueFilter.setValues([true]);
      });
    });
  });
  describe('#doesCellMatch()', () => {
    it('should return true for "test" value and "test" filter', () => {
      const stringValueFilter = new StringValueFilter('A', ['test']);
      const cell = new Cell(valueTypes.string, 'test');
      const result = stringValueFilter.doesCellMatch(cell);
      assert.equal(result, true);
    });
    it('should return false for "test1" value and "test" filter', () => {
      const stringValueFilter = new StringValueFilter('A', ['test']);
      const cell = new Cell(valueTypes.string, 'test1');
      const result = stringValueFilter.doesCellMatch(cell);
      assert.equal(result, false);
    });
    it('should return false for formula type', () => {
      const stringValueFilter = new StringValueFilter('A', ['test']);
      const cell = new Cell(valueTypes.formula, 'test');
      const result = stringValueFilter.doesCellMatch(cell);
      assert.equal(result, false);
    });
  });
});
