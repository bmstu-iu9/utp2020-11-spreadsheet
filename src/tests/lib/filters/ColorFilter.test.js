import * as assert from 'assert';
import ColorFilter from '../../../lib/filters/ColorFilter.js';
import { Cell, valueTypes } from '../../../lib/spreadsheets/Cell.js';

describe('ColorFilter', () => {
  describe('#setColors()', () => {
    it('should throw an exception for {}', () => {
      const colorFilter = new ColorFilter('A', []);
      assert.throws(() => {
        colorFilter.setColors({});
      }, (err) => {
        assert.strictEqual(err.name, 'TypeError');
        return true;
      });
    });
    it('should not throw an exception for []', () => {
      const colorFilter = new ColorFilter('A', []);
      assert.doesNotThrow(() => {
        colorFilter.setColors([]);
      });
    });
    it('should throw an exception for ["#fff"]', () => {
      const colorFilter = new ColorFilter('A', []);
      assert.throws(() => {
        colorFilter.setColors(['#fff'], (err) => {
          assert.strictEqual(err.name, 'FormatError');
          return true;
        });
      });
    });
    it('should not throw an exception for ["#ffffff"]', () => {
      const colorFilter = new ColorFilter('A', []);
      assert.doesNotThrow(() => {
        colorFilter.setColors(['#ffffff']);
      });
    });
  });
  describe('#doesCellMatch()', () => {
    it('should match cell with color #bbbbbb for colors ["#aaaaaa", "#bbbbbb"]', () => {
      const colorFilter = new ColorFilter('A', ['#aaaaaa', '#bbbbbb']);
      const cell = new Cell();
      cell.setColor('#bbbbbb');
      const doesMatch = colorFilter.doesCellMatch(cell);
      assert.strictEqual(doesMatch, true);
    });
    it('should not match cell with color #bbbbbb for colors []', () => {
      const colorFilter = new ColorFilter('A', []);
      const cell = new Cell();
      cell.setColor('#bbbbbb');
      const doesMatch = colorFilter.doesCellMatch(cell);
      assert.strictEqual(doesMatch, false);
    });
  });
  describe('#run()', () => {
    it('should match cells with color #aaaaaa in AA and without AA column', () => {
      const cells = [new Map([
        ['A67', new Cell(valueTypes.string, '', '#bbbbbb')],
      ]),
      new Map([
        ['AA5', new Cell(valueTypes.string, '', '#aaaaaa')],
      ]),
      new Map([
        ['AB99', new Cell(valueTypes.string, '', '#aaaaaa')],
        ['AA99', new Cell(valueTypes.string, '', '#aacaaa')],
      ])];
      const colorFilter = new ColorFilter('AA', ['#aaaaaa']);
      const filtered = colorFilter.run(cells);
      assert.deepStrictEqual(filtered, [cells[0], cells[1]]);
    });
    it('should throw an exception for 2 cells in one position', () => {
      const cells = [new Map([
        ['A67', new Cell(valueTypes.string, '', '#aaaaaa')],
        ['A7', new Cell(valueTypes.string, '', '#aaaaaa')],
      ])];
      const colorFilter = new ColorFilter('A', ['#aaaaaa']);
      assert.throws(() => {
        colorFilter.run(cells);
      }, (err) => {
        assert.strictEqual(err.name, 'FormatError');
        return true;
      });
    });
    it('should throw an exception for not cell value', () => {
      const cells = [new Map([
        ['A5', {}],
      ])];
      const colorFilter = new ColorFilter('A', ['#aaaaaa']);
      assert.throws(() => {
        colorFilter.run(cells);
      }, (err) => {
        assert.strictEqual(err.name, 'TypeError');
        return true;
      });
    });
  });
});
