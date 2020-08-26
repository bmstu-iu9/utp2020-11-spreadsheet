import * as assert from 'assert';
import Spreadsheet from '../../../lib/spreadsheets/Spreadsheet.js';
import { Cell, valueTypes } from '../../../lib/spreadsheets/Cell.js';
import FormatError from '../../../lib/errors/FormatError.js';
import Workbook from '../../../lib/spreadsheets/Workbook.js';

const spreadsheetStandardName = 'spreadsheet';

describe('Spreadsheet', () => {
  describe('#constructor()', () => {
    it('should create an empty spreadsheet', () => {
      const spreadsheet = new Spreadsheet('test');
      assert.strictEqual(spreadsheet.name, 'test');
      assert.strictEqual(spreadsheet.cells.keys.length, 0);
    });
    it('should create a spreadsheet with A1=10', () => {
      const cells = new Map();
      cells.set('A1', new Cell(valueTypes.number, 10));
      const spreadsheet = new Spreadsheet('table', cells);
      assert.strictEqual(spreadsheet.name, 'table');
      assert.strictEqual(spreadsheet.cells, cells);
    });
    it('should throw an exception for wrong cells', () => {
      const cells = new Map();
      cells.set('A1', {});
      assert.throws(() => {
        new Spreadsheet(spreadsheetStandardName, cells);
      }, TypeError);
    });
    it('should throw an exception for integer name', () => {
      assert.throws(() => {
        new Spreadsheet(1);
      }, FormatError);
    });
  });
  describe('#setName()', () => {
    it('should set name to Bob', () => {
      const spreadsheet = new Spreadsheet(spreadsheetStandardName);
      spreadsheet.setName('Bob');
      assert.strictEqual(spreadsheet.name, 'Bob');
    });
    it('should throw an exception for integer argument', () => {
      const spreadsheet = new Spreadsheet(spreadsheetStandardName);
      assert.throws(() => {
        spreadsheet.setName(1);
      }, FormatError);
    });
  });
  describe('#isNameCorrect()', () => {
    it('should return true for name "a"', () => {
      assert.strictEqual(Spreadsheet.isNameCorrect('a'), true);
    });
    it('should return false for an empty name', () => {
      assert.strictEqual(Spreadsheet.isNameCorrect(''), false);
    });
    it('should return false for a name " \\n "', () => {
      assert.strictEqual(Spreadsheet.isNameCorrect(' \n '), false);
    });
  });
  describe('#setCells()', () => {
    it('should set cells to B5=3, D3=false', () => {
      const spreadsheet = new Spreadsheet(spreadsheetStandardName);
      const cells = new Map();
      cells.set('B5', new Cell(valueTypes.number, 3));
      cells.set('D3', new Cell(valueTypes.boolean, false));
      spreadsheet.setCells(cells);
      assert.strictEqual(spreadsheet.cells, cells);
    });
    it('should throw an exception for integer key', () => {
      const cells = new Map();
      cells.set(1, new Cell());
      const spreadsheet = new Spreadsheet(spreadsheetStandardName);
      assert.throws(() => {
        spreadsheet.setCells(cells);
      }, FormatError);
    });
    it('should throw an exception for a non-map object', () => {
      const spreadsheet = new Spreadsheet(spreadsheetStandardName);
      assert.throws(() => {
        spreadsheet.setCells({});
      }, TypeError);
    });
  });
  describe('#getCell()', () => {
    it('should get an existing cell', () => {
      const spreadsheet = new Spreadsheet(spreadsheetStandardName);
      const cell = new Cell(valueTypes.boolean, true);
      spreadsheet.cells.set('A1', cell);
      assert.strictEqual(spreadsheet.getCell('A1'), cell);
    });
    it('should create an empty cell', () => {
      const spreadsheet = new Spreadsheet(spreadsheetStandardName);
      const cell = spreadsheet.getCell('A1');
      assert.strictEqual(cell.type, valueTypes.string);
    });
    it('should throw an exception for position 1A', () => {
      const spreadsheet = new Spreadsheet(spreadsheetStandardName);
      assert.throws(() => {
        spreadsheet.getCell('1A');
      }, FormatError);
    });
  });
  describe('#isPositionCorrect()', () => {
    it('should return true for B1', () => {
      assert.strictEqual(Spreadsheet.isPositionCorrect('B1'), true);
    });
    it('should return true for BAZ123', () => {
      assert.strictEqual(Spreadsheet.isPositionCorrect('BAZ123'), true);
    });
    it('should return false for A0', () => {
      assert.strictEqual(Spreadsheet.isPositionCorrect('A0'), false);
    });
    it('should return false for A5A', () => {
      assert.strictEqual(Spreadsheet.isPositionCorrect('A5A'), false);
    });
  });
  describe('#setValueInCell()', () => {
    it('should set value in cell', () => {
      const workbook = new Workbook('book');
      workbook.createSpreadsheet('list');
      const testCases = [
        {
          position: 'A1',
          type: valueTypes.number,
          value: 5,
        },
        {
          position: 'A2',
          type: valueTypes.formula,
          value: '=2*A1',
        },
        {
          position: 'A3',
          type: valueTypes.formula,
          value: '=A1+A2',
        },
        {
          position: 'A4',
          type: valueTypes.formula,
          value: '=A2-1',
        },
        {
          position: 'A4',
          type: valueTypes.formula,
          value: '=A3*7',
        },
      ];
      testCases.forEach((testCase) => workbook.spreadsheets[0]
        .setValueInCell(testCase.position, testCase.type, testCase.value));
      const checkMapIn = new Map([
        ['A1', new Set(['A2', 'A3'])],
        ['A2', new Set(['A3'])],
        ['A3', new Set(['A4'])],
        ['A4', new Set()],
      ]);
      assert.deepStrictEqual(workbook.spreadsheets[0].dependOn, checkMapIn);
      const checkMapOut = new Map([
        ['A1', new Set()],
        ['A2', new Set(['A1'])],
        ['A3', new Set(['A1', 'A2'])],
        ['A4', new Set(['A3'])],
      ]);
      assert.deepStrictEqual(workbook.spreadsheets[0].dependenciesOf, checkMapOut);
      assert.throws(() => {
        workbook.spreadsheets[0]
          .setValueInCell('A1', valueTypes.formula, '=A08');
      }, FormatError);
    });
  });
  describe('getPositionByIndexes', () => {
    const testCases = [
      {
        row: 0,
        column: 0,
        ans: 'A1',
      },
      {
        row: 0,
        column: 1,
        ans: 'B1',
      },
      {
        row: 132,
        column: 27,
        ans: 'AB133',
      },
      {
        row: 132,
        column: 26,
        ans: 'AA133',
      },
      {
        row: 132,
        column: 702,
        ans: 'AAA133',
      },
    ];
    testCases.forEach((test) => {
      it(`should return ${test.ans}`, () => {
        assert.strictEqual(
          Spreadsheet.getPositionByIndexes(test.row, test.column), test.ans,
        );
      });
    });
  });
});
