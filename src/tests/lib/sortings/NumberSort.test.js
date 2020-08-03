import * as assert from 'assert';
import NumberSort from '../../../lib/sorting/NumberSort.js';
import { Cell, valueTypes } from '../../../lib/spreadsheets/Cell.js';

describe('NumberSort', () => {
  describe('#constructor()', () => {
    it('should not throw an exception for \'A\', true', () => {
      assert.doesNotThrow(() => new NumberSort('A', true));
    });
    it('should throw an exception for \'A\', 5', () => {
      assert.throws(() => new NumberSort('A', 5), (err) => {
        assert.strictEqual(err.name, 'TypeError');
        return true;
      });
    });
  });
  describe('#compareFunction()', () => {
    const results = {
      positive: (answer) => answer > 0,
      negative: (answer) => answer < 0,
      zero: (answer) => answer === 0,
    };
    const testCases = [{
      description: 'should return positive number for 7 and 5 descending',
      sort: ['A', true],
      cellA: [valueTypes.number, 7],
      cellB: [valueTypes.number, 5],
      result: results.positive,
    },
    {
      description: 'should return negative number for 7 and 5 ascending',
      sort: ['A', false],
      cellA: [valueTypes.number, 7],
      cellB: [valueTypes.number, 5],
      result: results.negative,
    },
    {
      description: 'should return zero for 5 and 5 descending',
      sort: ['A', true],
      cellA: [valueTypes.number, 5],
      cellB: [valueTypes.number, 5],
      result: results.zero,
    },
    {
      description: 'should return zero for 5 and 5 ascending',
      sort: ['A', false],
      cellA: [valueTypes.number, 5],
      cellB: [valueTypes.number, 5],
      result: results.zero,
    },
    {
      description: 'should return zero for two strings',
      sort: ['A', true],
      cellA: [valueTypes.string, 'a'],
      cellB: [valueTypes.string, 'b'],
      result: results.zero,
    },
    {
      description: 'should return negative for number and string',
      sort: ['A', true],
      cellA: [valueTypes.number, 1],
      cellB: [valueTypes.string, 'abc'],
      result: results.negative,
    },
    {
      description: 'should return positive for string and number',
      sort: ['A', true],
      cellA: [valueTypes.string, 'abc'],
      cellB: [valueTypes.number, 1],
      result: results.positive,
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
  describe('#run()', () => {
    it('should throw an exception for 2 cells in one position', () => {
      const cells = [new Map([
        ['A67', new Cell(valueTypes.number, 1, '#aaaaaa')],
        ['A7', new Cell(valueTypes.number, 1, '#aaaaaa')],
      ])];
      const numberSort = new NumberSort('A', true);
      assert.throws(() => {
        numberSort.run(cells);
      }, (err) => {
        assert.strictEqual(err.name, 'FormatError');
        return true;
      });
    });
    it('should throw an exception for not cell value', () => {
      const cells = [new Map([
        ['A5', {}],
      ])];
      const numberSort = new NumberSort('A', true);
      assert.throws(() => {
        numberSort.run(cells);
      }, (err) => {
        assert.strictEqual(err.name, 'TypeError');
        return true;
      });
    });
  });
});
