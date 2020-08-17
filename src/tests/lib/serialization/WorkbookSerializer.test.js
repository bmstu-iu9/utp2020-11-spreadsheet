import * as assert from 'assert';
import fs from 'fs';
import schema from 'jsonschema';
import Workbook from '../../../lib/spreadsheets/Workbook.js';
import Spreadsheet from '../../../lib/spreadsheets/Spreadsheet.js';
import WorkbookSerializer from '../../../lib/serialization/WorkbookSerializer.js';
import { Cell, valueTypes } from '../../../lib/spreadsheets/Cell.js';
import FormatError from '../../../lib/errors/FormatError.js';

const workbookStandardName = 'workbook';
const spreadsheetStandardName = 'spreadsheet';
const tableSchema = JSON.parse(fs.readFileSync('./resources/tableSchema.json'));

describe('WorkbookSerializer', () => {
  describe('#serialize()', () => {
    it('should create a valid json file', () => {
      const cells = new Map();
      cells.set('A1', new Cell(valueTypes.number, 10));
      const spreadsheets = [new Spreadsheet(spreadsheetStandardName, cells)];
      const workbook = new Workbook(workbookStandardName, spreadsheets);
      assert.strictEqual(
        schema.validate(WorkbookSerializer.serialize(workbook), tableSchema).valid,
        true,
      );
    });
    it('should throw an exception for an empty workbook', () => {
      assert.throws(() => {
        WorkbookSerializer.serialize(null);
      }, FormatError);
    });
  });
});
