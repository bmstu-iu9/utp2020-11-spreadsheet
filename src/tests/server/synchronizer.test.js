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
  describe('#constructor()', () => {
    it('should make new element', () => {
      mock({
        './synchronizer': {},
      });
      ClassConverter.saveJson(workbook, './synchronizer');
      const sz = new Synchronizer('test', './synchronizer', 0);
      assert.deepEqual(sz.workbook, workbook);
      assert.deepEqual(sz.page, 0);
      mock.restore();
    });
  });
  describe('#addArrayLogs()', () => {
    it('should add valid log (change color)', () => {
      mock({
        './synchronizer': {},
      });
      ClassConverter.saveJson(workbook, './synchronizer');
      const sz = new Synchronizer('test', './synchronizer', 0);
      assert.deepEqual(sz.addArrayLogs([log1], 0), true);
      assert.deepEqual(sz.workbook.spreadsheets[0]
        .cells.get(log1.cellAddress).color, log1.color);
      mock.restore();
    });
    it('should add valid log (change value)', () => {
      mock({
        './synchronizer': {},
      });
      ClassConverter.saveJson(workbook, './synchronizer');
      const sz = new Synchronizer('test', './synchronizer', 0);
      assert.deepEqual(sz.addArrayLogs([log2], 0), true);
      assert.deepEqual(sz.workbook.spreadsheets[0]
        .cells.get(log2.cellAddress).formula, log2.formula);
      assert.deepEqual(sz.workbook.spreadsheets[0]
        .cells.get(log2.cellAddress).value, log2.value);
      mock.restore();
    });
    it('should add invalid log', () => {
      mock({
        './synchronizer': {},
      });
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
      mock({
        './synchronizer': {},
      });
      ClassConverter.saveJson(workbook, './synchronizer');
      const sz = new Synchronizer('test', './synchronizer', 0);
      sz.addArrayLogs([log2], 0);
      assert.deepEqual(sz.addArrayLogs([log4], 0), [log2]);
      mock.restore();
    });
  });
  describe('#clearCheckChanges()', () => {
    it('should clear check changes', () => {
      mock({
        './synchronizer': {},
      });
      ClassConverter.saveJson(workbook, './synchronizer');
      const sz = new Synchronizer('test', './synchronizer', 0);
      sz.addArrayLogs([log1, log2], 0);
      sz.clearCheckChanges();
      assert.deepEqual(sz.lastChanges, [{ ID: 0 }]);
      mock.restore();
    });
  });
  describe('#synchronize()', () => {
    it('should synchronize', () => {
      mock({
        './synchronizer': {},
      });
      ClassConverter.saveJson(workbook, './synchronizer');
      const sz = new Synchronizer('test', './synchronizer', 0);
      sz.synchronize();
      mock.restore();
    });
  });
});
