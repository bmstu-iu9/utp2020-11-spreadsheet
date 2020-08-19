import * as assert from 'assert';
import { Synchronizer, zeroID } from '../../../lib/synchronization/Synchronizer.js';
import Spreadsheet from '../../../lib/spreadsheets/Spreadsheet.js';
import { Cell, valueTypes } from '../../../lib/spreadsheets/Cell.js';
import FormatError from '../../../lib/errors/FormatError.js';
import Workbook from '../../../lib/spreadsheets/Workbook.js';

const log1 = {
  ID: 'cf3c1cf6-be2f-4a6a-b69b-97b9c1126065',
  changeType: 'color',
  cellAddress: 'A1',
  color: '#aaaaaa',
  page: 0,
};
const log2 = {
  ID: 'a67a8ec6-4741-4fbc-b8e9-3ac69ec96559',
  changeType: 'value',
  cellAddress: 'A2',
  type: 'formula',
  value: '=2+2',
  page: 0,
};
const log3 = {
  ID: '65d0104f-b9af-4de4-acc3-1c696bd0c715',
  changeType: 'pupailupa',
  page: 0,
};
const log4 = {
  ID: 'd1150ba6-488f-440c-82c0-02f8c53910b5',
  changeType: 'value',
  cellAddress: 'A2',
  type: 'formula',
  value: '=4',
  page: 0,
};
const log5 = {
  ID: '7cc880c8-2579-421e-9bff-4e35ff7e536c',
  changeType: 'value',
  cellAddress: 'A2',
  type: 'formula',
  value: '=5',
  page: 1,
};

describe('Synchronizer', () => {
  const getSynchronizer = () => {
    const spreadsheet1 = new Spreadsheet('test', new Map([
      ['A5', new Cell(valueTypes.number, 100, '#ffffff')],
      ['A6', new Cell(valueTypes.boolean, true, '#edeef0')],
    ]));
    const spreadsheet2 = new Spreadsheet('test2');
    const workbook = new Workbook('workbook', [spreadsheet1, spreadsheet2]);
    return {
      sz: new Synchronizer(workbook),
      workbook,
    };
  };

  describe('#constructor()', () => {
    it('should make new element', () => {
      const { sz, workbook } = getSynchronizer();
      assert.strictEqual(sz.workbook, workbook);
      assert.deepStrictEqual(sz.acceptedCommits, [{ ID: zeroID }]);
    });
    it('should throw an exception for non-spreadsheet', () => {
      assert.throws(() => {
        new Synchronizer({});
      }, TypeError);
    });
    it('should throw an exception for non-array', () => {
      const { workbook } = getSynchronizer();
      assert.throws(() => {
        new Synchronizer(workbook, {});
      });
    });
  });
  describe('#addCommits()', () => {
    it('should add valid log (change color)', () => {
      const { sz } = getSynchronizer();
      assert.deepStrictEqual(sz.addCommits([log1], zeroID), []);
      assert.strictEqual(sz.workbook.spreadsheets[0]
        .cells.get(log1.cellAddress).color, log1.color);
    });
    it('should add valid log (change value)', () => {
      const { sz } = getSynchronizer();
      assert.deepStrictEqual(sz.addCommits([log2], zeroID), []);
      assert.strictEqual(sz.workbook.spreadsheets[0]
        .cells.get(log2.cellAddress).formula, log2.formula);
      assert.strictEqual(sz.workbook.spreadsheets[0]
        .cells.get(log2.cellAddress).value, log2.value);
    });
    it('should add invalid log', () => {
      const { sz } = getSynchronizer();
      assert.throws(() => {
        sz.addCommits([log3], zeroID);
      }, FormatError);
      sz.addCommits([log1], zeroID);
      assert.throws(() => {
        sz.addCommits([log3], log1.ID);
      });
    });
    it('should add collision log', () => {
      const { sz } = getSynchronizer();
      sz.addCommits([log2], zeroID);
      assert.deepStrictEqual(sz.addCommits([log4], zeroID), [log2]);
    });
    it('should add log with invalid ID', () => {
      const { sz } = getSynchronizer();
      assert.throws(() => {
        sz.addCommits([log1], '2448c5f7-0649-4994-80f7-d9de4883574d');
      }, FormatError);
    });
    it('should successfully add logs for different pages', () => {
      const { sz } = getSynchronizer();
      assert.deepStrictEqual(sz.addCommits([log4], zeroID), []);
      assert.deepStrictEqual(sz.addCommits([log5], zeroID), []);
    });
  });
});
