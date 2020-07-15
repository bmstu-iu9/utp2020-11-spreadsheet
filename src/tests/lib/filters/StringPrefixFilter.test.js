import * as assert from 'assert';
import StringPrefixFilter from '../../../lib/filters/StringPrefixFilter.js';
import { Cell, valueTypes } from '../../../lib/spreadsheets/Cell.js';

describe('StringPrefixFilter', () => {
  describe('#doesValueMatch()', () => {
    it('should return true for "test123" and "test" filter', () => {
      const stringPrefixFilter = new StringPrefixFilter('A', ['test']);
      const cell = new Cell(valueTypes.string, 'test123');
      const result = stringPrefixFilter.doesCellMatch(cell);
      assert.equal(result, true);
    });
    it('should return false for "test" and "test123" filter', () => {
      const stringPrefixFilter = new StringPrefixFilter('A', ['test123']);
      const cell = new Cell(valueTypes.string, 'test');
      const result = stringPrefixFilter.doesCellMatch(cell);
      assert.equal(result, false);
    });
    it('should return false for formula cell', () => {
      const stringPrefixFilter = new StringPrefixFilter('A', ['=1']);
      const cell = new Cell(valueTypes.formula, '=1');
      const result = stringPrefixFilter.doesCellMatch(cell);
      assert.strictEqual(result, false);
    });
  });
});
