import * as assert from 'assert';
import NumberSort from '../../../lib/sorting/NumberSort.js';
import { Cell, valueTypes } from '../../../lib/spreadsheets/Cell.js';

describe('NumberSort', () => {
  describe('#constructor()', () => {
    it('should not throw an exception for \'A\', true', () => {
      assert.doesNotThrow(() => new NumberSort('A', true));
    });
    it('should throw an exception for \'A\', 5', () => {
      assert.throws(() => new NumberSort('A', 5));
    });
  });
  describe('#compareFunction()', () => {
    const testCases = [{
      description: 'should return positive number for 7 and 5 descending',
      sort: ['A', true],
      cellA: [valueTypes.number, 7],
      cellB: [valueTypes.number, 5],
      result: (answer) => answer > 0,
    },
    {
      description: 'should return negative number for 7 and 5 ascending',
      sort: ['A', false],
      cellA: [valueTypes.number, 7],
      cellB: [valueTypes.number, 5],
      result: (answer) => answer < 0,
    },
    {
      description: 'should return zero for 5 and 5 descending',
      sort: ['A', true],
      cellA: [valueTypes.number, 5],
      cellB: [valueTypes.number, 5],
      result: (answer) => answer === 0,
    },
    {
      description: 'should return zero for 5 and 5 ascending',
      sort: ['A', false],
      cellA: [valueTypes.number, 5],
      cellB: [valueTypes.number, 5],
      result: (answer) => answer === 0,
    }];
    testCases.forEach((testCase) => {
      it(testCase.description, () => {
        const numberSort = new NumberSort(...testCase.sort);
        const cellA = new Cell(...testCase.cellA);
        const cellB = new Cell(...testCase.cellB);
        assert.strictEqual(testCase.result(numberSort.compareFunction(cellA, cellB)), true);
      });
    });
  });
});
