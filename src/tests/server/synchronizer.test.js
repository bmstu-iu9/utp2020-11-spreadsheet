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
        A1: {
          color: '#ffffff',
          type: 'number',
          value: 100,
        },
        A2: {
          color: '#edeef0',
          type: 'boolean',
          value: true,
        },
      },
    },
    {
      name: 'My Sheet',
      cells: {
        A1: {
          color: '#000000',
          type: 'formula',
          value: '=B2+1',
        },
        B2: {
          color: '#aaaaaa',
          type: 'string',
          value: 'some string',
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
  cellAddress: 'B1',
  valueType: 'formula',
  value: '=2+2',
};
const log3 = {
  type: 'value',
  cellAddress: 'A1',
  valueType: 'number',
  value: '99',
};
const cancelLog = {
  type: 'cancelChange',
};
const log5 = {
  type: 'color',
  cellAddress: 'B2',
  value: '#edeef0',
};
const cancelCancelLog = {
  type: 'cancelСancelChange',
};

describe('Synchronizer', () => {
  mock({
    './synchronizer': {},
  });
  fs.mkdirSync('./synchronizer/way', { recursive: true });
  fs.writeFileSync('./synchronizer/way/test.json', JSON.stringify(workbook));
  describe('#constructor()', () => {
    const sz = new Synchronizer('./synchronizer/way/test.json', 0);
    it('should make new element', () => {
      assert.deepEqual(sz.jsonWorkbook, workbook);
      assert.deepEqual(sz.page, 0);
    });
  });
  describe('#addLog()', () => {
    const sz = new Synchronizer('./synchronizer/way/test.json', 0);
    it('should add valid log without cancel change', () => {
      sz.addLog(log1);
      sz.addLog(log2);
      sz.addLog(log3);
      assert.deepEqual(sz.logs, [log1, log2, log3]);
    });
    it('should add valid log with cancel change', () => {
      sz.addLog(cancelLog);
      sz.addLog(log5);
      assert.deepEqual(sz.logs, [log1, log2, log5]);
      sz.synchronize();
      sz.addLog(cancelLog);
      sz.addLog(log5);
      assert.deepEqual(sz.logs, [log1, log2, log5]);
    });
    it('should add valid log with cancel-cancel change', () => {
      sz.addLog(cancelLog);
      assert.deepEqual(sz.cancelChange, 1);
      sz.addLog(cancelCancelLog);
      assert.deepEqual(sz.logs, [log1, log2, log5]);
      assert.deepEqual(sz.cancelChange, 0);
    });
    it('should add invalid log with cancel change', () => {
      sz.addLog(cancelLog);
      sz.addLog(cancelLog);
      sz.addLog(cancelLog);
      assert.throws(() => {
        sz.addLog(cancelLog);
      });
    });
    it('should add invalid log with cancel-cancel change', () => {
      sz.addLog(cancelCancelLog);
      sz.addLog(cancelCancelLog);
      sz.addLog(cancelCancelLog);
      assert.throws(() => {
        sz.addLog(cancelCancelLog);
      });
    });
  });
  describe('#addArrayLogs()', () => {
    const sz = new Synchronizer('./synchronizer/way/test.json', 0);
    it('should add array logs', () => {
      const ar = [log3, log5, log1];
      sz.addArrayLogs(ar);
      assert.deepEqual(sz.logs, ar);
    });
  });
  describe('#updateLogSize()', () => {
    const sz = new Synchronizer('./synchronizer/way/test.json', 0);
    const ar = [];
    for (let i = 0; i < Synchronizer.maxLogSize() + 1; i += 1) {
      ar.push(log1);
    }
    it('should use after update: static workbook', () => {
      sz.logs = [];
      sz.lastPosLogs = ar.length - Synchronizer.minLogSize() - 1;
      sz.addArrayLogs(ar);
      assert.deepEqual(sz.logs.length, Synchronizer.minLogSize());
    });
    it('should use after update: last workbook', () => {
      sz.logs = [];
      sz.lastPosLogs = ar.length - Synchronizer.minLogSize();
      sz.addArrayLogs(ar);
      assert.deepEqual(sz.logs.length, Synchronizer.minLogSize());
    });
    it('should use after update: new workbook (from last)', () => {
      sz.logs = [];
      sz.lastPosLogs = ar.length - Synchronizer.minLogSize() + 1;
      sz.addArrayLogs(ar);
      assert.deepEqual(sz.logs.length, Synchronizer.minLogSize());
    });
  });
  describe('#updateWorkbook()', () => {
    const sz = new Synchronizer('./synchronizer/way/test.json', 0);
    it('should update workbook with invalid type log', () => {
      sz.addLog({ type: 'invalid', value: 'me' });
      assert.throws(() => {
        sz.updateWorkbook();
      });
    });
  });
  describe('#synchronize()', () => {
    const sz = new Synchronizer('./synchronizer/way/test.json', 0);
    it('should return: static workbook', () => {
      sz.synchronize();
    });
    it('should return: last workbook', () => {
      sz.addLog(log1);
      sz.synchronize();
    });
    it('should return: new workbook (from static)', () => {
      sz.addLog(cancelLog);
      sz.synchronize();
    });
  });
  mock.restore();
});
