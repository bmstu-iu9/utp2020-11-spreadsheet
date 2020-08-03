import * as assert from 'assert';
import StringSort from '../../../lib/sorting/StringSort.js';
import { Cell, valueTypes } from '../../../lib/spreadsheets/Cell.js';

describe('StringSort', () => {
  describe('#constructor()', () => {
    it('should not throw an exception for \'A\', true', () => {
      assert.doesNotThrow(() => new StringSort('A', true));
    });
    it('should throw an exception for \'A\', 5', () => {
      assert.throws(() => new StringSort('A', 5));
    }, (err) => {
      assert.strictEqual(err.name, 'TypeError');
      return true;
    });
  });
  describe('#compareFunction()', () => {
    const results = {
      positive: (answer) => answer > 0,
      negative: (answer) => answer < 0,
      zero: (answer) => answer === 0,
    };
    const testCases = [{
      description: 'should return negative number for \'a\' and \'b\' in alphabet order',
      sort: ['A', true],
      cellA: [valueTypes.string, 'a'],
      cellB: [valueTypes.string, 'b'],
      result: results.negative,
    },
    {
      description: 'should return negative number for \'ab\' and \'a\' not in alphabet order',
      sort: ['A', false],
      cellA: [valueTypes.string, 'ab'],
      cellB: [valueTypes.string, 'a'],
      result: results.negative,
    },
    {
      description: 'should return zero for \'a\' and \'a\' in alphabet order',
      sort: ['A', true],
      cellA: [valueTypes.string, 'a'],
      cellB: [valueTypes.string, 'a'],
      result: results.zero,
    },
    {
      description: 'should return zero for \'a\' and \'a\' not in alphabet order',
      sort: ['A', false],
      cellA: [valueTypes.string, 'a'],
      cellB: [valueTypes.string, 'a'],
      result: results.zero,
    },
    {
      description: 'should return zero for two numbers',
      sort: ['A', true],
      cellA: [valueTypes.number, 1],
      cellB: [valueTypes.number, 2],
      result: results.zero,
    },
    {
      description: 'should return positive for number and string',
      sort: ['A', true],
      cellA: [valueTypes.number, 1],
      cellB: [valueTypes.string, 'abc'],
      result: results.positive,
    }];
    testCases.forEach((testCase) => {
      it(testCase.description, () => {
        const stringSort = new StringSort(...testCase.sort);
        const cellA = new Cell(...testCase.cellA);
        const cellB = new Cell(...testCase.cellB);
        assert.strictEqual(testCase.result(stringSort.compareFunction(cellA, cellB)), true);
      });
    });
  });
});
