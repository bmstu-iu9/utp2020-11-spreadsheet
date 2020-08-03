import * as assert from 'assert';
import FilterGroup from '../../../lib/filters/FilterGroup.js';
import ColorFilter from '../../../lib/filters/ColorFilter.js';
import StringValueFilter from '../../../lib/filters/StringValueFilter.js';
import Spreadsheet from '../../../lib/spreadsheets/Spreadsheet.js';
import { Cell, valueTypes } from '../../../lib/spreadsheets/Cell.js';

describe('FilterGroup', () => {
  describe('#constructor()', () => {
    it('should throw an exception for 5A:A6 interval', () => {
      assert.throws(() => {
        new FilterGroup('5A', 'A6');
      }, (err) => {
        assert.strictEqual(err.name, 'FormatError');
        return true;
      });
    });
    it('should throw an exception for {} filters', () => {
      assert.throws(() => {
        new FilterGroup('A5', 'A6', {});
      });
    }, (err) => {
      assert.strictEqual(err.name, 'TypeError');
      return true;
    });
    it('should throw an exception for [1] filters', () => {
      assert.throws(() => {
        new FilterGroup('A5', 'A6', [1]);
      }, (err) => {
        assert.strictEqual(err.name, 'TypeError');
        return true;
      });
    });
  });
  describe('#run()', () => {
    it('should throw an exception for {} spreadsheet', () => {
      const filterGroup = new FilterGroup('A1', 'A1');
      assert.throws(() => {
        filterGroup.run({});
      }, (err) => {
        assert.strictEqual(err.name, 'TypeError');
        return true;
      });
    });
    it('should filter 4th and 5th rows', () => {
      const cells = new Map([
        ['A3', new Cell(valueTypes.string, '', '#aaaaaa')],
        ['A4', new Cell(valueTypes.string, '', '#abcdef')],
        ['A5', new Cell(valueTypes.string, '', '#abcdef')],
        ['B5', new Cell(valueTypes.string, 'test')],
        ['A6', new Cell(valueTypes.string, '', '#abcdef')],
      ]);
      const spreadsheet = new Spreadsheet('a', cells);
      const filterGroup = new FilterGroup('A1', 'D5', [
        new ColorFilter('A', ['#abcdef']),
        new StringValueFilter('B', ['test']),
      ]);
      const result = filterGroup.run(spreadsheet);
      const answer = [
        new Map([['A4', cells.get('A4')]]),
        new Map([['A5', cells.get('A5')], ['B5', cells.get('B5')]]),
      ];
      assert.deepStrictEqual(result, answer);
    });
  });
});
