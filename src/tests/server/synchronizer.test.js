import * as assert from 'assert';
import mock from 'mock-fs';
import fs from 'fs';
import Synchronizer from '../../server/synchronization/synchronizer.js';

const workbook = {
  name: 'My Table',
  sheets: [
    {
      name: 'My Sheet',
      cells: {
        A5: {
          color: '#ffffff',
          type: 'number',
          value: 100,
        },
        A6: {
          color: '#edeef0',
          type: 'boolean',
          value: true,
        },
      },
    },
  ],
};
const log1 = {
  type: 'color',
  cellAddress: 'A1',
  color: '#aaaaaa',
};
const log2 = {
  type: 'value',
  cellAddress: 'A2',
  valueType: 'formula',
  value: '=2+2',
};
const log3 = {
  type: 'pupailupa',
};
describe('Synchronizer', () => {
  mock({
    './synchronizer': {},
  });
  const log4 = {
    type: 'value',
    cellAddress: 'A2',
    valueType: 'formula',
    value: '=4',
  };
  fs.mkdirSync('./synchronizer/way', { recursive: true });
  fs.writeFileSync('./synchronizer/way/test.json', JSON.stringify(workbook));
  describe('#constructor()', () => {
    const sz = new Synchronizer('./synchronizer/way/test.json', 0);
    it('should make new element', () => {
      assert.deepEqual(sz.jsonWorkbook, workbook);
      assert.deepEqual(sz.page, 0);
    });
  });
  describe('#addArrayLogs()', () => {
    const sz = new Synchronizer('./synchronizer/way/test.json', 0);
    it('should add valid log (change color)', () => {
      assert.deepEqual(sz.addArrayLogs([log1]), undefined);
      assert.deepEqual(sz.jsonWorkbook.sheets[sz.page]
        .cells[log1.cellAddress].color, log1.color);
    });
    it('should add valid log (change value)', () => {
      assert.deepEqual(sz.addArrayLogs([log2]), undefined);
      assert.deepEqual(sz.jsonWorkbook.sheets[sz.page]
        .cells[log2.cellAddress].type, log2.valueType);
      assert.deepEqual(sz.jsonWorkbook.sheets[sz.page]
        .cells[log2.cellAddress].value, log2.value);
    });
    it('should add invalid log', () => {
      assert.throws(() => {
        sz.addArrayLogs([log3]);
      });
    });
    it('should add collision log', () => {
      assert.deepEqual(sz.addArrayLogs([log4]), { first: log2, second: log4 });
      assert.deepEqual(sz.jsonWorkbook.sheets[sz.page]
        .cells[log4.cellAddress].type, log4.valueType);
      assert.deepEqual(sz.jsonWorkbook.sheets[sz.page]
        .cells[log4.cellAddress].value, log4.value);
    });
  });
  describe('#clearCheckChanges()', () => {
    const sz = new Synchronizer('./synchronizer/way/test.json', 0);
    it('should clear check changes', () => {
      sz.addArrayLogs([log1, log2]);
      sz.clearCheckChanges();
      assert.deepEqual(sz.lastChanges, new Map());
    });
  });
  describe('#synchronize()', () => {
    const sz = new Synchronizer('./synchronizer/way/test.json', 0);
    sz.synchronize();
    it('should synchronize', () => {});
  });
  mock.restore();
});
