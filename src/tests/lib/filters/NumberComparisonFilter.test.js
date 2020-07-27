import * as assert from 'assert';
import { NumberComparisonFilter, operators } from '../../../lib/filters/NumberComparisonFilter.js';
import { Cell, valueTypes } from '../../../lib/spreadsheets/Cell.js';

describe('NumberComparisonFilter', () => {
  describe('#constructor()', () => {
    it('should not throw an exception for "A", "more", 5', () => {
      assert.doesNotThrow(() => {
        new NumberComparisonFilter('A', operators.more, 5);
      });
    });
    it('should not throw an exception for "A", "moreOrLess", 5', () => {
      assert.throws(() => {
        new NumberComparisonFilter('A', 'moreOrLess', 5);
      });
    });
  });
  describe('#doesCellMatch()', () => {
    const testCases = [{
      description: 'should return true for 5 = 5',
      filter: ['A', operators.equal, 5],
      cell: [valueTypes.number, 5],
      result: true,
    },
    {
      description: 'should return false for 5 > 6',
      filter: ['A', operators.more, 6],
      cell: [valueTypes.number, 5],
      result: false,
    },
    {
      description: 'should return true for 6 >= 6',
      filter: ['A', operators.moreOrEqual, 6],
      cell: [valueTypes.number, 6],
      result: true,
    },
    {
      description: 'should return false for 7 < -1',
      filter: ['A', operators.less, -1],
      cell: [valueTypes.number, 7],
      result: false,
    },
    {
      description: 'should return true for -1 <= 0',
      filter: ['A', operators.lessOrEqual, 0],
      cell: [valueTypes.number, -1],
      result: true,
    },
    {
      description: 'should return false for -10 != -10',
      filter: ['A', operators.notEqual, -10],
      cell: [valueTypes.number, -10],
      result: false,
    },
    ];
    testCases.forEach((testCase) => {
      it(testCase.description, () => {
        const numberComparisonFilter = new NumberComparisonFilter(...testCase.filter);
        const cell = new Cell(...testCase.cell);
        const result = numberComparisonFilter.doesCellMatch(cell);
        assert.strictEqual(result, testCase.result);
      });
    });
  });
});
