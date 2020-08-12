import * as assert from 'assert';
import mock from 'mock-fs';
import fs from 'fs';
import Workbook from '../../../lib/spreadsheets/Workbook.js';
import Spreadsheet from '../../../lib/spreadsheets/Spreadsheet.js';
import WorkbookSerializer from '../../../server/serialization/WorkbookSerializer.js';
import WorkbookDeserializer from '../../../server/serialization/WorkbookDeserializer.js';
import { Cell, valueTypes } from '../../../lib/spreadsheets/Cell.js';

const workbookStandardName = 'workbook';
const spreadsheetStandardName = 'spreadsheet';
const pathToWorkbooks = './workbooks/alexis';

describe('JsonConverter', () => {
  describe('#readCells()', () => {
    it('should return a map of cells', () => {
      let cells = {
        A1: {
          color: '#ffffff',
          type: valueTypes.number,
          value: 10,
        },
        A2: {
          color: '#ffffff',
          type: valueTypes.number,
          value: 11,
        },
        A3: {
          color: '#ffffff',
          type: valueTypes.number,
          value: 13,
        },
      };
      cells = WorkbookDeserializer.readCells(cells);
      const testCells = new Map();
      testCells.set('A1', new Cell(valueTypes.number, 10));
      testCells.set('A2', new Cell(valueTypes.number, 11));
      testCells.set('A3', new Cell(valueTypes.number, 13));
      assert.strictEqual(JSON.stringify(cells), JSON.stringify(testCells));
    });
    it('should return an empty map', () => {
      assert.strictEqual(
        JSON.stringify(WorkbookDeserializer.readCells({})), JSON.stringify(new Map()),
      );
    });
  });
  describe('#readSpreadsheets()', () => {
    it('should return an array of sheets', () => {
      let spreadsheets = [
        {
          name: 'Sheet1',
          cells: {
            A1: {
              color: '#ffffff',
              type: valueTypes.number,
              value: 10,
            },
          },
        },
        {
          name: 'Sheet2',
          cells: {
            A2: {
              color: '#ffffff',
              type: valueTypes.boolean,
              value: true,
            },
          },
        },
      ];
      spreadsheets = WorkbookDeserializer.readSpreadsheets(spreadsheets);
      const testSpreadsheets = [
        new Spreadsheet('Sheet1', new Map([['A1', new Cell(valueTypes.number, 10)]])),
        new Spreadsheet('Sheet2', new Map([['A2', new Cell(valueTypes.boolean, true)]])),
      ];
      assert.strictEqual(JSON.stringify(spreadsheets), JSON.stringify(testSpreadsheets));
    });
    it('should return an empty array', () => {
      assert.strictEqual(
        JSON.stringify(WorkbookDeserializer.readSpreadsheets([])), JSON.stringify([]),
      );
    });
  });
  describe('#readWorkbook()', () => {
    it('should read Workbook from correct json-file', () => {
      mock({
        './workbooks': {},
      });
      const cells = new Map();
      cells.set('A1', new Cell(valueTypes.number, 10));
      const spreadsheets = [new Spreadsheet(spreadsheetStandardName, cells)];
      const workbook = new Workbook(workbookStandardName, spreadsheets);
      WorkbookSerializer.saveJson(workbook, pathToWorkbooks);
      const testWorkbook = WorkbookDeserializer.readWorkbook(`${pathToWorkbooks}/${workbookStandardName}.json`);
      assert.strictEqual(JSON.stringify(workbook), JSON.stringify(testWorkbook));
      mock.restore();
    });
    it('should throw an exception for a nonexistent file', () => {
      mock({
        './workbooks': {},
      });
      fs.mkdirSync(pathToWorkbooks, { recursive: true });
      assert.throws(() => {
        WorkbookDeserializer.readWorkbook(`${pathToWorkbooks}/${workbookStandardName}.json`);
      });
      mock.restore();
    });
  });
});
