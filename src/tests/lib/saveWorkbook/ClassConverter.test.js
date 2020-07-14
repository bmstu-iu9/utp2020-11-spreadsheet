import * as assert from 'assert';
import fs from 'fs';
import mock from 'mock-fs';
import schema from 'jsonschema';
import Workbook from '../../../lib/spreadsheets/Workbook.js';
import Spreadsheet from '../../../lib/spreadsheets/Spreadsheet.js';
import ClassConverter from '../../../lib/saveWorkbook/ClassConverter.js';
import {
  valueTypes,
  Cell,
} from '../../../lib/spreadsheets/Cell.js';

const workbookStandardName = 'workbook';
const spreadsheetStandardName = 'spreadsheet';
const pathToWorkbooks = '~/workbooks/alexis';
const tableSchema = JSON.parse(fs.readFileSync('./resources/tableSchema.json'));

describe('ClassConverter', () => {
  describe('#convertToJson()', () => {
    it('should create a valid json file', () => {
      const cells = new Map();
      cells.set('A1', new Cell(valueTypes.number, 10));
      const spreadsheets = [new Spreadsheet(spreadsheetStandardName, cells)];
      const workbook = new Workbook(workbookStandardName, spreadsheets);
      assert.strictEqual(
        schema.validate(JSON.parse(ClassConverter.convertToJson(workbook)), tableSchema).valid,
        true,
      );
    });
    it('should throw an exception for an empty workbook', () => {
      assert.throws(() => {
        ClassConverter.convertToJson(null);
      });
    });
  });
  describe('#saveJson()', () => {
    it('should create workbook.json', () => {
      const cells = new Map();
      cells.set('A1', new Cell(valueTypes.number, 10));
      const spreadsheets = [new Spreadsheet(spreadsheetStandardName, cells)];
      const workbook = new Workbook(workbookStandardName, spreadsheets);
      mock({
        '~/workbooks': {},
      });
      ClassConverter.saveJson(workbook, pathToWorkbooks);
      assert.strictEqual(fs.existsSync(`${pathToWorkbooks}/${workbookStandardName}.json`), true);
      mock.restore();
    });
    it('should throw an exeption for creating file without permission', () => {
      const spreadsheets = [new Spreadsheet(spreadsheetStandardName)];
      const workbook = new Workbook(workbookStandardName, spreadsheets);
      mock({
        '~/workbooks': mock.directory({
          mode: '0555',
          items: {},
        }),
      });
      assert.throws(() => {
        ClassConverter.saveJson(workbook, pathToWorkbooks);
      });
      mock.restore();
    });
  });
});
