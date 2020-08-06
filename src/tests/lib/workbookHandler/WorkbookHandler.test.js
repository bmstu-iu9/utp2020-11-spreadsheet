import * as assert from 'assert';
import WorkbookHandler from '../../../lib/workbookHandler/WorkbookHandler.js';
import mock from 'mock-fs';
import Workbook from '../../../lib/spreadsheets/Workbook.js';
import Spreadsheet from '../../../lib/spreadsheets/Spreadsheet.js';
import ClassConverter from '../../../lib/saveWorkbook/ClassConverter.js';
import JsonConverter from '../../../lib/readWorkbook/JsonConverter.js';
import { Cell, valueTypes } from '../../../lib/spreadsheets/Cell.js';
import Database from 'better-sqlite3';
import UserModel from '../../../server/database/UserModel.js';
import WorkbookRepo from '../../../server/database/WorkbookRepo.js';
import UserRepo from '../../../server/database/UserRepo.js';
import WorkbookModel from '../../../server/database/WorkbookModel.js';
import DatabaseError from '../../../lib/errors/DatabaseError.js';

const pathToDatabase = 'database.db';
const path = './';
const workbookStandardName = 'workbook';
const spreadsheetStandardName = 'spreadsheet';
let database;
let workbookRepo;
let userRepo;
let workbookHandler;

describe('WorkbookHandler', () => {
  before(() => {
    database = new Database(pathToDatabase);
    workbookRepo = new WorkbookRepo(database);
    userRepo = new UserRepo(database);
    workbookHandler = new WorkbookHandler(database);
    workbookRepo.dropTable();
    userRepo.dropTable();
  });
  beforeEach(() => {
    workbookRepo.createTable();
    userRepo.createTable();
  });
  afterEach(() => {
    workbookRepo.dropTable();
    userRepo.dropTable();
  });
  after(() => database.close());
  describe('#get()', () => {
    it('should give response 200', () => {
      mock({
        './': {},
      });
      userRepo.save(new UserModel('alexis', 'abcdef', false));
      const cells = new Map();
      cells.set('A1', new Cell(valueTypes.number, 10));
      const spreadsheets = [new Spreadsheet(spreadsheetStandardName, cells)];
      const workbook = new Workbook(workbookStandardName, spreadsheets);
      ClassConverter.saveJson(workbook, './');
      const workbookModel = new WorkbookModel(`./${workbookStandardName}.json`, 'alexis');
      workbookRepo.save(workbookModel);
      assert.strictEqual(workbookHandler.get('alexis').response, 200);
      mock.restore();
    });
    it('should give response 401 for no books', () => {
      assert.strictEqual(workbookHandler.get('vabalabadabdab').response, 401);
    });
  });
});
