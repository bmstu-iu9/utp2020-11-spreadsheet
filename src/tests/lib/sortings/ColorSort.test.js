import * as assert from 'assert';
import ColorSort from '../../../lib/sorting/ColorSort.js';
import { Cell, valueTypes } from '../../../lib/spreadsheets/Cell.js';

describe('ColorSort', () => {
  describe('#setColors()', () => {
    it('should throw an exception for {}', () => {
      const colorSort = new ColorSort('A', []);
      assert.throws(() => {
        colorSort.setColors({});
      });
    });
    it('should not throw an exception for []', () => {
      const colorSort = new ColorSort('A', []);
      assert.doesNotThrow(() => {
        colorSort.setColors([]);
      });
    });
    it('should throw an exception for ["#aaa"]', () => {
      const colorSort = new ColorSort('A', []);
      assert.throws(() => {
        colorSort.setColors(['#aaa']);
      });
    });
    it('should not throw an exception for ["#aaaaaa"]', () => {
      const colorSort = new ColorSort('A', []);
      assert.doesNotThrow(() => {
        colorSort.setColors(['#aaaaaa']);
      });
    });
  });
  describe('#compareFunction()', () => {
    const results = {
      positive: (answer) => answer > 0,
      negative: (answer) => answer < 0,
      zero: (answer) => answer === 0,
    };

    const colors = ['#b60e3e', '#1d34bf', '#ffffff'];
    const colorSort = new ColorSort('A', colors);

    it('should return positive for two colors from array', () => {
      const cellA = new Cell(valueTypes.number, 1, '#ffffff');
      const cellB = new Cell(valueTypes.number, 1, '#1d34bf');
      assert.strictEqual(results.positive(colorSort.compareFunction(cellA, cellB)), true);
    });
    it('should return negative for one color from array and color not from it', () => {
      const cellA = new Cell(valueTypes.number, 1, '#1d34bf');
      const cellB = new Cell(valueTypes.number, 1, '#ece81b');
      assert.strictEqual(results.negative(colorSort.compareFunction(cellA, cellB)), true);
    });
    it('should return positive for one color not from array and color from it', () => {
      const cellA = new Cell(valueTypes.number, 1, '#ece81b');
      const cellB = new Cell(valueTypes.number, 1, '#ffffff');
      assert.strictEqual(results.positive(colorSort.compareFunction(cellA, cellB)), true);
    });
    it('should return zero for two colors not from array', () => {
      const cellA = new Cell(valueTypes.number, 1, '#3fd714');
      const cellB = new Cell(valueTypes.number, 1, '#ece81b');
      assert.strictEqual(results.zero(colorSort.compareFunction(cellA, cellB)), true);
    });
  });
});
