import * as assert from 'assert';
import mock from 'mock-fs';
import Synchronizer from '../../server/synchronization/synchronizer.js';
import ClassConverter from '../../lib/saveWorkbook/ClassConverter.js';

const workbook = {
  name: 'test',
  spreadsheets: [
    {
      name: 'My Sheet',
      cells: new Map([
        ['A5', {
          color: '#ffffff',
          type: 'number',
          value: 100,
        }],
        ['A6', {
          color: '#edeef0',
          type: 'boolean',
          value: true,
        }]]),
    },
  ],
};
const log1 = {
  ID: 1,
  changeType: 'color',
  cellAddress: 'A1',
  color: '#aaaaaa',
};
const log2 = {
  ID: 2,
  changeType: 'value',
  cellAddress: 'A2',
  type: 'formula',
  value: '=2+2',
};
const log3 = {
  ID: 3,
  changeType: 'pupailupa',
};
const log4 = {
  ID: 4,
  changeType: 'value',
  cellAddress: 'A2',
  type: 'formula',
  value: '=4',
};
describe('Synchronizer', () => {
  beforeEach(() => {
    mock({
      './synchronizer': {},
    });
  });
  afterEach(() => {
    mock.restore();
  });
  describe('#constructor()', () => {
    it('should make new element', () => {
      ClassConverter.saveJson(workbook, './synchronizer');
      const sz = new Synchronizer('test', './synchronizer', 0);
      assert.strictEqual(sz.workbook.name, workbook.name);
      assert.strictEqual(sz.workbook.spreadsheets.length, workbook.spreadsheets.length);
      assert.strictEqual(sz.workbook.spreadsheets[0].name, workbook.spreadsheets[0].name);
      sz.workbook.spreadsheets[0].cells.forEach((cell, position) => {
        const cellFromSz = cell;
        const cellFromJSON = workbook.spreadsheets[0].cells.get(position);
        assert.strictEqual(cellFromSz.type, cellFromJSON.type);
        assert.strictEqual(cellFromSz.value, cellFromJSON.value);
        assert.strictEqual(cellFromSz.color, cellFromJSON.color);
      });
      assert.deepStrictEqual(sz.page, 0);
    });
  });
  describe('#addArrayLogs()', () => {
    it('should add valid log (change color)', () => {
      ClassConverter.saveJson(workbook, './synchronizer');
      const sz = new Synchronizer('test', './synchronizer', 0);
      assert.deepStrictEqual(sz.addArrayLogs([log1], 0), true);
      assert.deepStrictEqual(sz.workbook.spreadsheets[0]
        .cells.get(log1.cellAddress).color, log1.color);
    });
    it('should add valid log (change value)', () => {
      ClassConverter.saveJson(workbook, './synchronizer');
      const sz = new Synchronizer('test', './synchronizer', 0);
      assert.deepStrictEqual(sz.addArrayLogs([log2], 0), true);
      assert.deepStrictEqual(sz.workbook.spreadsheets[0]
        .cells.get(log2.cellAddress).formula, log2.formula);
      assert.deepStrictEqual(sz.workbook.spreadsheets[0]
        .cells.get(log2.cellAddress).value, log2.value);
    });
    it('should add invalid log', () => {
      ClassConverter.saveJson(workbook, './synchronizer');
      const sz = new Synchronizer('test', './synchronizer', 0);
      assert.throws(() => {
        sz.addArrayLogs([log3], 0);
      });
      sz.addArrayLogs([log1], 0);
      assert.throws(() => {
        sz.addArrayLogs([log3], -1);
      });
    });
    it('should add collision log', () => {
      ClassConverter.saveJson(workbook, './synchronizer');
      const sz = new Synchronizer('test', './synchronizer', 0);
      sz.addArrayLogs([log2], 0);
      assert.deepStrictEqual(sz.addArrayLogs([log4], 0), [log2]);
    });
  });
  describe('#clearCheckChanges()', () => {
    it('should clear check changes', () => {
      ClassConverter.saveJson(workbook, './synchronizer');
      const sz = new Synchronizer('test', './synchronizer', 0);
      sz.addArrayLogs([log1, log2], 0);
      sz.clearCheckChanges();
      assert.deepStrictEqual(sz.lastChanges, [{ ID: 0 }]);
    });
  });
  describe('#synchronize()', () => {
    it('should synchronize', () => {
      ClassConverter.saveJson(workbook, './synchronizer');
      const sz = new Synchronizer('test', './synchronizer', 0);
      sz.synchronize();
    });
  });
});
