import * as assert from 'assert';
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
const userStandartName = 'alexis';
const tableSchema = {
  $schema: 'https://json-schema.org/draft/2019-09/schema',
  type: 'object',
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
    },
    additionalProperties: false,
    sheets: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          name: {
            type: 'string',
          },
          cells: {
            type: 'object',
            patternProperties: {
              '^[A-Z]+[1-9][0-9]*$': {
                type: 'object',
                additionalProperties: false,
                properties: {
                  color: {
                    type: 'string',
                    pattern: '^#[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]$',
                  },
                  type: {
                    oneOf: [
                      {
                        pattern: '^boolean$',
                      },
                      {
                        pattern: '^number$',
                      },
                      {
                        pattern: '^string$',
                      },
                      {
                        pattern: '^formula$',
                      },
                    ],
                  },
                  value: {
                    type: [
                      'number',
                      'boolean',
                      'string',
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  required: [
    'sheets',
  ],
};

describe('ClassConverter', () => {
  describe('#convertToJson()', () => {
    it('should create a valid jason file', () => {
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
      assert.strictEqual(ClassConverter.saveJson(userStandartName, workbook, '~/workbooks'), true);
      mock.restore();
    });
    it('should throw an exception for incorrect path to workbooks', () => {
      const spreadsheets = [new Spreadsheet(spreadsheetStandardName)];
      const workbook = new Workbook(workbookStandardName, spreadsheets);
      mock({
        '~/workbooks': {},
      });
      assert.throws(() => {
        ClassConverter.saveJson(userStandartName, workbook, '~/src');
      });
      mock.restore();
    });
  });
});
