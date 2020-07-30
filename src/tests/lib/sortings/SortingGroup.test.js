import assert from 'assert';
import { Cell, valueTypes } from '../../../lib/spreadsheets/Cell.js';
import Spreadsheet from '../../../lib/spreadsheets/Spreadsheet.js';
import NumberSort from '../../../lib/sorting/NumberSort.js';
import SortingGroup from '../../../lib/sorting/SortingGroup.js';
import StringSort from '../../../lib/sorting/StringSort.js';

describe('SortingGroup', () => {
  describe('#constructor()', () => {
    it('should throw an exception for 5B:C7 interval', () => {
      assert.throws(() => new SortingGroup('5B', 'C7'));
    });
    it('should throw an exception for {} sorting', () => {
      assert.throws(() => new SortingGroup('B5', 'C7', {}));
    });
    it('should throw an exception for [1] sorting', () => {
      assert.throws(() => new SortingGroup('B5', 'C7', [1]));
    });
  });

  describe('#run()', () => {
    const cells = new Map([
      ['A1', new Cell(valueTypes.number, 1)],
      ['A2', new Cell(valueTypes.number, 2)],
      ['A3', new Cell(valueTypes.number, 2)],
      ['A4', new Cell(valueTypes.number, 3)],
      ['A5', new Cell(valueTypes.number, 4)],
      ['A6', new Cell(valueTypes.number, 4)],
      ['A7', new Cell(valueTypes.number, 8)],
      ['B1', new Cell(valueTypes.number, 4)],
      ['B2', new Cell(valueTypes.string, 'so')],
      ['B3', new Cell(valueTypes.string, 's')],
      ['B4', new Cell(valueTypes.string, 'r')],
      ['B6', new Cell(valueTypes.string, 'm')],
    ]);
    it('should throw an exception for {} spreadsheet', () => {
      const sortingGroup = new SortingGroup('A1', 'A1');
      assert.throws(() => {
        sortingGroup.run({});
      });
    });
    it('should sorting workbook with several sorts', () => {
      const spreadsheet = new Spreadsheet('a', cells);
      const sortGroup = new SortingGroup('A1', 'B6', [
        new StringSort('B', true),
        new NumberSort('A', true),
      ]);
      const result = sortGroup.run(spreadsheet);
      const answer = [
        new Map([['A1', cells.get('A1')], ['B1', cells.get('B1')]]),
        new Map([['A3', cells.get('A3')], ['B3', cells.get('B3')]]),
        new Map([['A2', cells.get('A2')], ['B2', cells.get('B2')]]),
        new Map([['A4', cells.get('A4')], ['B4', cells.get('B4')]]),
        new Map([['A6', cells.get('A6')], ['B6', cells.get('B6')]]),
        new Map([['A5', cells.get('A5')]]),
      ];
      assert.deepStrictEqual(result, answer);
    });
  });
});
