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
    });
  });
  describe('#compareFunction()', () => {
    const testCases = [{
      description: 'should return negative number for \'a\' and \'b\' in alphabet order',
      sort: ['A', true],
      cellA: [valueTypes.string, 'a'],
      cellB: [valueTypes.string, 'b'],
      result: (answer) => answer < 0,
    },
    {
      description: 'should return negative number for \'ab\' and \'a\' not in alphabet order',
      sort: ['A', false],
      cellA: [valueTypes.string, 'ab'],
      cellB: [valueTypes.string, 'a'],
      result: (answer) => answer < 0,
    },
    {
      description: 'should return zero for \'a\' and \'a\' in alphabet order',
      sort: ['A', true],
      cellA: [valueTypes.string, 'a'],
      cellB: [valueTypes.string, 'a'],
      result: (answer) => answer === 0,
    },
    {
      description: 'should return zero for \'a\' and \'a\' not in alphabet order',
      sort: ['A', false],
      cellA: [valueTypes.string, 'a'],
      cellB: [valueTypes.string, 'a'],
      result: (answer) => answer === 0,
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
