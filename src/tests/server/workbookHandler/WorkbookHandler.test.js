import * as assert from 'assert';
import mock from 'mock-fs';
import Database from 'better-sqlite3';
import WorkbookHandler from '../../../server/workbookHandler/WorkbookHandler.js';
import Workbook from '../../../lib/spreadsheets/Workbook.js';
import Spreadsheet from '../../../lib/spreadsheets/Spreadsheet.js';
import ClassConverter from '../../../lib/saveWorkbook/ClassConverter.js';
import { Cell, valueTypes } from '../../../lib/spreadsheets/Cell.js';
import UserModel from '../../../server/database/UserModel.js';
import WorkbookModel from '../../../server/database/WorkbookModel.js';
import FormatError from '../../../lib/errors/FormatError.js';
import TokenModel from '../../../server/database/TokenModel.js';
import DataRepo from '../../../server/database/DataRepo.js';

const pathToDatabase = 'database.db';
const workbookStandardName = 'workbook';
const spreadsheetStandardName = 'spreadsheet';
let dataRepo;
let database;
let workbookHandler;
const workbook = {
  name: 'test',
  spreadsheets: [
    {
      name: 'My Sheet',
      cells: new Map([
        ['A5', {
          color: '#ffffff',
          type: 'number',
          value: 100,
        }],
        ['A6', {
          color: '#edeef0',
          type: 'boolean',
          value: true,
        }]]),
    },
  ],
};

describe('WorkbookHandler', () => {
  before(() => {
    database = new Database(pathToDatabase);
    dataRepo = new DataRepo(database);
    workbookHandler = new WorkbookHandler(database);
    dataRepo.createDatabase();
    dataRepo.workbookRepo.dropTable();
    dataRepo.userRepo.dropTable();
    dataRepo.tokenRepo.dropTable();
  });
  beforeEach(() => {
    dataRepo.createDatabase();
  });
  afterEach(() => {
    dataRepo.workbookRepo.dropTable();
    dataRepo.userRepo.dropTable();
    dataRepo.tokenRepo.dropTable();
  });
  after(() => {
    workbookHandler.close();
    database.close();
  });
  describe('#get()', () => {
    it('should give response 200 and array of books', () => {
      mock({
        './': {},
      });
      dataRepo.userRepo.save(new UserModel('alexis', 'abcdef', false));
      const cells = new Map();
      cells.set('A1', new Cell(valueTypes.number, 10));
      const spreadsheets = [new Spreadsheet(spreadsheetStandardName, cells)];
      const book = new Workbook(workbookStandardName, spreadsheets);
      const workbookModel = new WorkbookModel(`./${workbookStandardName}.json`, 'alexis');
      ClassConverter.saveJson(book, './');
      dataRepo.workbookRepo.save(workbookModel);
      assert.strictEqual(workbookHandler.get('alexis').response, 200);
      assert.strictEqual(workbookHandler.get('alexis').content.length, 1);
      mock.restore();
    });
    it('should give response 401 for no books', () => {
      assert.strictEqual(workbookHandler.get('vabalabadabdab').response, 401);
    });
    it('should throw an error for getting books without login', () => {
      assert.throws(() => {
        workbookHandler.get();
      }, FormatError);
    });
  });
  describe('#post()', () => {
    it('should throw an error for creating book without login', () => {
      assert.throws(() => {
        let login;
        workbookHandler.post(login, 'someWorkbook', 'somePath');
      }, FormatError);
    });
    it('should throw an error for creating book without book', () => {
      assert.throws(() => {
        let book;
        workbookHandler.post('alexis', book, 'somePath');
      }, FormatError);
    });
    it('should throw an error for creating book without path', () => {
      assert.throws(() => {
        let path;
        workbookHandler.post('alexis', 'someWorkbook', path);
      }, FormatError);
    });
    it('should give response 401 for unauthorized user', () => {
      dataRepo.userRepo.save(new UserModel('alexis', 'abcdef', true));
      assert.strictEqual(workbookHandler.post('alexis', 'someWorkbook', 'somePath').response, 401);
    });
    it('should give response 200 and object', () => {
      dataRepo.userRepo.save(new UserModel('alexis', 'abcdef', false));
      dataRepo.tokenRepo.save(new TokenModel('alexis'));
      const result = workbookHandler.post('alexis', workbook, '.');
      assert.strictEqual(result.response, 200);
      assert.strictEqual(typeof result.content, 'object');
    });
    it('should give response 400 for incorrect request', () => {
      dataRepo.userRepo.save(new UserModel('alexis', 'abcdef', false));
      dataRepo.tokenRepo.save(new TokenModel('alexis'));
      assert.strictEqual(workbookHandler.post('alexis', workbook, './').response, 400);
    });
  });
});
