import * as assert from 'assert';
import fs from 'fs';
import mock from 'mock-fs';
import schema from 'jsonschema';
import Workbook from '../../../lib/spreadsheets/Workbook.js';
import Spreadsheet from '../../../lib/spreadsheets/Spreadsheet.js';
import ClassConverter from '../../../lib/saveWorkbook/ClassConverter.js';
import JsonConverter from '../../../lib/readWorkbook/JsonConverter.js';
import {
  valueTypes,
  Cell,
} from '../../../lib/spreadsheets/Cell.js';

const workbookStandardName = 'workbook';
const spreadsheetStandardName = 'spreadsheet';
const pathToWorkbooks = '/home/alexis/project/utp2020-11-spreadsheet/src/workbooks/alexis';

const cells = new Map();
cells.set('A1', new Cell(valueTypes.number, 10));
const spreadsheets = [new Spreadsheet(spreadsheetStandardName, cells)];
const workbook = new Workbook(workbookStandardName, spreadsheets);
console.log(workbook);
//ClassConverter.saveJson(workbook, pathToWorkbooks);
const test = JsonConverter.readWorkbook(`${pathToWorkbooks}/${workbookStandardName}.json`);
console.log(test);
if (JSON.stringify(test) === JSON.stringify(workbook)) {
  console.log('FUUUCK YEAAAH');
}
