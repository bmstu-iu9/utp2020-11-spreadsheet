import * as assert from 'assert';
import mock from 'mock-fs';
import WorkbookHandler from '../../../server/workbookHandler/WorkbookHandler.js';
import ClassConverter from '../../../lib/saveWorkbook/ClassConverter.js';
import WorkbookModel from '../../../server/database/WorkbookModel.js';
import FormatError from '../../../lib/errors/FormatError.js';
import TestEnvironment from '../database/TestEnvironment.js';

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
  let environment;
  let workbookHandler;

  before(() => {
    environment = new TestEnvironment();
    workbookHandler = new WorkbookHandler(environment.dataRepo);
    environment.init();
    environment.dataRepo.workbookRepo.dropTable();
    environment.dataRepo.userRepo.dropTable();
    environment.dataRepo.tokenRepo.dropTable();
  });
  beforeEach(() => {
    environment = TestEnvironment.getInstance();
    environment.init();
  });
  afterEach(() => {
    environment.dataRepo.workbookRepo.dropTable();
    environment.dataRepo.userRepo.dropTable();
    environment.dataRepo.tokenRepo.dropTable();
    TestEnvironment.destroyInstance();
  });
  describe('#get()', () => {
    it('should give response 200 and array of books', () => {
      mock({
        './': {},
      });
      environment.addUsers(1, true);
      const workbookModel = new WorkbookModel('./test.json', 'test0');
      ClassConverter.saveJson(workbook, './');
      environment.dataRepo.workbookRepo.save(workbookModel);
      assert.strictEqual(workbookHandler.get('test0').response, 200);
      assert.strictEqual(workbookHandler.get('test0').content.length, 1);
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
      environment.addUsers(1, false);
      assert.strictEqual(workbookHandler.post('test0', 'someWorkbook', 'somePath').response, 401);
    });
    it('should give response 200 and object', () => {
      mock({
        './': {},
      });
      environment.addUsers(1, true);
      const result = workbookHandler.post('test0', workbook, '.');
      assert.strictEqual(result.response, 200);
      assert.strictEqual(typeof result.content, 'object');
      mock.restore();
    });
    it('should give response 400 for incorrect request', () => {
      mock({
        './': {},
      });
      environment.addUsers(1, true);
      assert.strictEqual(workbookHandler.post('test0', workbook, './').response, 400);
      mock.restore();
    });
  });
  describe('#delete()', () => {
    it('should give response 401 for unauthorized user', () => {
      environment.addUsers(1);
      assert.strictEqual(workbookHandler.delete('test0', 0).response, 401);
    });
    it('should give response 404 for unfound book', () => {
      environment.addUsers(1, true);
      assert.strictEqual(workbookHandler.delete('test0', 228).response, 404);
    });
    it('should give response 403 for deleting book without access permission', () => {
      mock({
        './': {},
      });
      environment.addUsers(2, true);
      const workbookModel = new WorkbookModel('./test.json', 'test0');
      ClassConverter.saveJson(workbook, './');
      const id = environment.dataRepo.workbookRepo.save(workbookModel);
      assert.strictEqual(workbookHandler.delete('test1', id).response, 403);
      mock.restore();
    });
    it('should give response 200 for successful deletion', () => {
      mock({
        './': {},
      });
      environment.addUsers(1, true);
      const workbookModel = new WorkbookModel('./test.json', 'test0');
      ClassConverter.saveJson(workbook, './');
      const id = environment.dataRepo.workbookRepo.save(workbookModel);
      assert.strictEqual(workbookHandler.delete('test0', id).response, 200);
      mock.restore();
    });
  });
});
