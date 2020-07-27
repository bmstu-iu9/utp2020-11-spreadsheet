import * as assert from 'assert';
import ColumnFilter from '../../../lib/filters/ColumnFilter.js';
import { Cell } from '../../../lib/spreadsheets/Cell.js';

describe('ColumnFilter', () => {
  describe('#constructor()', () => {
    it('should throw an error for column A5', () => {
      assert.throws(() => {
        new ColumnFilter('A5');
      });
    });
  });
  describe('#setColumn()', () => {
    it('should throw an error for column 55', () => {
      const columnFilter = new ColumnFilter('A');
      assert.throws(() => {
        columnFilter.setColumn('55');
      });
    });
    it('should not throw an error for column ABA', () => {
      const columnFilter = new ColumnFilter('A');
      assert.doesNotThrow(() => {
        columnFilter.setColumn('ABA');
      });
    });
  });
  describe('#doesPositionMatch()', () => {
    it('should match AB3 position for AB column', () => {
      const columnFilter = new ColumnFilter('AB');
      assert.strictEqual(columnFilter.doesPositionMatch('AB3'), true);
    });
    it('should match ABA57 position for ABA column', () => {
      const columnFilter = new ColumnFilter('ABA');
      assert.strictEqual(columnFilter.doesPositionMatch('ABA57'), true);
    });
    it('should not match ABA57 position for AB column', () => {
      const columnFilter = new ColumnFilter('AB');
      assert.strictEqual(columnFilter.doesPositionMatch('ABA57'), false);
    });
  });
  describe('#run()', () => {
    it('should match AB3, AB12 cells and not BA13 cell for AB column', () => {
      const columnFilter = new ColumnFilter('AB');
      const cells = new Map([
        ['AB3', new Cell()],
        ['AB12', new Cell()],
        ['BA13', new Cell()],
      ]);
      const filtered = columnFilter.run(cells);
      assert.strictEqual(filtered.has('AB12'), true);
      assert.strictEqual(filtered.has('AB3'), true);
      assert.strictEqual(filtered.has('BA13'), false);
    });
  });
});
