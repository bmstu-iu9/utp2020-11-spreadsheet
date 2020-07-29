import assert from 'assert';
import FilterGroup from '../../../lib/filters/FilterGroup.js';
import { Cell, valueTypes } from '../../../lib/spreadsheets/Cell.js';
import Spreadsheet from '../../../lib/spreadsheets/Spreadsheet.js';
import NumberSort from '../../../lib/sorting/NumberSort.js';
import SortingGroup from '../../../lib/sorting/SortingGroup.js';

describe('FilterGroup', () => {
  describe('#run()', () => {
    it('should throw an exception for {} spreadsheet', () => {
      const filterGroup = new FilterGroup('A1', 'A1');
      assert.throws(() => {
        filterGroup.run({});
      });
    });
    it('should filter 4th and 5th rows', () => {
      const cells = new Map([
        ['A3', new Cell(valueTypes.number, 1, '#aaaaaa')],
        ['A4', new Cell(valueTypes.number, 2, '#abcdef')],
        ['A5', new Cell(valueTypes.number, 3, '#abcdef')],
        ['B5', new Cell(valueTypes.number, 4)],
        ['A6', new Cell(valueTypes.number, 5, '#abcdef')],
      ]);
      const spreadsheet = new Spreadsheet('a', cells);
      const sortGroup = new SortingGroup('A1', 'D5', [
        new NumberSort('A', true),
      ]);
      const result = sortGroup.run(spreadsheet);
      const answer = [
        new Map([['A3', cells.get('A3')]]),
        new Map([['A4', cells.get('A4')]]),
        new Map([['A5', cells.get('A5')], ['B5', cells.get('B5')]]),
      ];
      assert.deepStrictEqual(result, answer);
    });
  });
});
