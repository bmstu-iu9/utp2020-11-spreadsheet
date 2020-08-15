import * as assert from 'assert';
import { Synchronizer, zeroID } from '../../../server/synchronization/Synchronizer.js';
import Spreadsheet from '../../../lib/spreadsheets/Spreadsheet.js';
import { Cell, valueTypes } from '../../../lib/spreadsheets/Cell.js';
import FormatError from '../../../lib/errors/FormatError.js';

const spreadsheet = new Spreadsheet('test', new Map([
  ['A5', new Cell(valueTypes.number, 100, '#ffffff')],
  ['A6', new Cell(valueTypes.boolean, true, '#edeef0')],
]));

const log1 = {
  ID: 'cf3c1cf6-be2f-4a6a-b69b-97b9c1126065',
  changeType: 'color',
  cellAddress: 'A1',
  color: '#aaaaaa',
};
const log2 = {
  ID: 'a67a8ec6-4741-4fbc-b8e9-3ac69ec96559',
  changeType: 'value',
  cellAddress: 'A2',
  type: 'formula',
  value: '=2+2',
};
const log3 = {
  ID: '65d0104f-b9af-4de4-acc3-1c696bd0c715',
  changeType: 'pupailupa',
};
const log4 = {
  ID: 'd1150ba6-488f-440c-82c0-02f8c53910b5',
  changeType: 'value',
  cellAddress: 'A2',
  type: 'formula',
  value: '=4',
};

const lastChanges = [{ ID: zeroID }];
const sz = new Synchronizer(spreadsheet);

describe('Synchronizer', () => {
  describe('#constructor()', () => {
    it('should make new element', () => {
      const sync = new Synchronizer(spreadsheet);
      assert.strictEqual(sync.spreadsheet, spreadsheet);
      assert.deepStrictEqual(sync.lastChanges, lastChanges);
      assert.strictEqual(sync.maxLogSize, 10);
    });
    it('should throw an exception for non-spreadsheet', () => {
      assert.throws(() => {
        new Synchronizer({});
      }, TypeError);
    });
    it('should throw an exception for non-array', () => {
      assert.throws(() => {
        new Synchronizer(spreadsheet, {});
      });
    });
    it('should throw an exception for non-integer', () => {
      assert.throws(() => {
        new Synchronizer(spreadsheet, lastChanges, 23.4);
      });
    });
  });
  describe('#addArrayLogs()', () => {
    it('should add valid log (change color)', () => {
      assert.deepStrictEqual(sz.addArrayLogs([log1], zeroID), true);
      assert.deepStrictEqual(sz.spreadsheet
        .cells.get(log1.cellAddress).color, log1.color);
    });
    it('should add valid log (change value)', () => {
      const sz = new Synchronizer(spreadsheet);
      assert.deepStrictEqual(sz.addArrayLogs([log2], zeroID), true);
      assert.deepStrictEqual(sz.spreadsheet
        .cells.get(log2.cellAddress).formula, log2.formula);
      assert.deepStrictEqual(sz.spreadsheet
        .cells.get(log2.cellAddress).value, log2.value);
    });
    it('should add invalid log', () => {
      const sz = new Synchronizer(spreadsheet);
      assert.throws(() => {
        sz.addArrayLogs([log3], zeroID);
      }, FormatError);
      sz.addArrayLogs([log1], zeroID);
      assert.throws(() => {
        sz.addArrayLogs([log3], log1.ID);
      });
    });
    it('should add collision log', () => {
      const sz = new Synchronizer(spreadsheet);
      sz.addArrayLogs([log2], zeroID);
      assert.deepStrictEqual(sz.addArrayLogs([log4], zeroID), [log2]);
    });
    it('should add log with invalid ID', () => {
      assert.throws(() => {
        sz.addArrayLogs(log1, '2448c5f7-0649-4994-80f7-d9de4883574d');
      }, FormatError);
    });
  });
});
