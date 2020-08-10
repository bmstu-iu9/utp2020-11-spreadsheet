import * as assert from 'assert';
import express from 'express';
import request from 'supertest';
import mock from 'mock-fs';
import WorkbookHandler from '../../../server/workbookHandler/WorkbookHandler.js';
import ClassConverter from '../../../lib/saveWorkbook/ClassConverter.js';
import WorkbookModel from '../../../server/database/WorkbookModel.js';
import FormatError from '../../../lib/errors/FormatError.js';
import TestEnvironment from '../database/TestEnvironment.js';
import UserModel from '../../../server/database/UserModel.js';
import Authorizer from '../../../server/authorization/Authorizer.js';
import TokenAuthenticator from '../../../server/authorization/TokenAuthenticator.js';
import HeaderMatcher from '../../../server/authorization/HeaderMatcher.js';

const testWorkbook = {
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
const app = express();

describe('WorkbookHandler', () => {
  let environment;
  let workbookHandler;

  beforeEach(() => {
    environment = TestEnvironment.getInstance();
    workbookHandler = new WorkbookHandler(environment.dataRepo);
    environment.init();
  });
  afterEach(() => {
    TestEnvironment.destroyInstance();
  });
  after(() => {
    app.delete({});
  });
  describe('#get()', () => {
    it('should give response 200 and array of books', (done) => {
      mock({
        './': {},
      });
      app.get('/workbook/get', workbookHandler.get);
      environment.addUsers(1, true);
      const { username, token } = environment.userTokens[0];
      const matcher = new HeaderMatcher('authorization', 'Token ');
      const authenticator = new TokenAuthenticator(matcher, environment.dataRepo);
      const authorizer = new Authorizer(authenticator);
      const req = {
        headers: {
          Authorization: `Token ${token.uuid}`,
        },
      };
      app.use(authorizer.getMiddleware());
      const workbookModel = new WorkbookModel('./test.json', username);
      ClassConverter.saveJson(testWorkbook, './');
      environment.dataRepo.workbookRepo.save(workbookModel);
      request(app)
        .get('/workbook/get')
        .send(req)
        .expect(200, done);
      // assert.strictEqual(workbookHandler.get({ login: 'test0' }, {}).response, 200);
      // assert.strictEqual(workbookHandler.get({ login: 'test0' }, {}).content.length, 1);
      mock.restore();
    });
    // it('should give response 401 for no books', (done) => {
    //   request(app)
    //     .get('/workbook/get')
    //     .send(new UserModel('vabalabadabdab', '123', false))
    //     .expect(401, done);
    // });
    // it('should give response 401 for getting books without login', (done) => {
    //   let userModel;
    //   request(app)
    //     .get('/workbook/get')
    //     .send(userModel)
    //     .expect(401, done);
    // });
  });
  // describe('#post()', () => {
  //   it('should throw an error for creating book without login', () => {
  //     assert.throws(() => {
  //       const request = {
  //         login: '',
  //         workbook: 'someWorkbook',
  //         pathToWorkbooks: 'somePath',
  //       };
  //       workbookHandler.post(request, {});
  //     }, FormatError);
  //   });
  //   it('should throw an error for creating book without book', () => {
  //     assert.throws(() => {
  //       let book;
  //       const request = {
  //         login: 'alexis',
  //         workbook: book,
  //         pathToWorkbooks: 'somePath',
  //       };
  //       workbookHandler.post(request, {});
  //     }, FormatError);
  //   });
  //   it('should throw an error for creating book without path', () => {
  //     assert.throws(() => {
  //       let path;
  //       const request = {
  //         login: 'alexis',
  //         workbook: 'someWorkbook',
  //         pathToWorkbooks: path,
  //       };
  //       workbookHandler.post(request, {});
  //     }, FormatError);
  //   });
  //   it('should give response 401 for unauthorized user', () => {
  //     environment.addUsers(1, false);
  //     const request = {
  //       login: 'test0',
  //       workbook: 'someWorkbook',
  //       pathToWorkbooks: 'somePath',
  //     };
  //     assert.strictEqual(workbookHandler.post(request, {}).response, 401);
  //   });
  //   it('should give response 200 and object', () => {
  //     mock({
  //       './': {},
  //     });
  //     environment.addUsers(1, true);
  //     const request = {
  //       login: 'test0',
  //       workbook: testWorkbook,
  //       pathToWorkbooks: '.',
  //     };
  //     const result = workbookHandler.post(request, {});
  //     assert.strictEqual(result.response, 200);
  //     assert.strictEqual(typeof result.content, 'object');
  //     mock.restore();
  //   });
  //   it('should give response 400 for incorrect request', () => {
  //     mock({
  //       './': {},
  //     });
  //     environment.addUsers(1, true);
  //     const request = {
  //       login: 'test0',
  //       workbook: testWorkbook,
  //       pathToWorkbooks: './',
  //     };
  //     assert.strictEqual(workbookHandler.post(request, {}).response, 400);
  //     mock.restore();
  //   });
  // });
  // describe('#delete()', () => {
  //   it('should give response 401 for unauthorized user', () => {
  //     environment.addUsers(1);
  //     const request = {
  //       login: 'test0',
  //       workbookID: 0,
  //     };
  //     assert.strictEqual(workbookHandler.delete(request, {}).response, 401);
  //   });
  //   it('should give response 404 for unfound book', () => {
  //     environment.addUsers(1, true);
  //     const request = {
  //       login: 'test0',
  //       workbookID: 228,
  //     };
  //     assert.strictEqual(workbookHandler.delete(request, {}).response, 404);
  //   });
  //   it('should give response 403 for deleting book without access permission', () => {
  //     mock({
  //       './': {},
  //     });
  //     environment.addUsers(2, true);
  //     const workbookModel = new WorkbookModel('./test.json', 'test0');
  //     ClassConverter.saveJson(testWorkbook, './');
  //     const id = environment.dataRepo.workbookRepo.save(workbookModel);
  //     const request = {
  //       login: 'test2',
  //       workbookID: id,
  //     };
  //     assert.strictEqual(workbookHandler.delete(request, {}).response, 403);
  //     mock.restore();
  //   });
  //   it('should give response 200 for successful deletion', () => {
  //     mock({
  //       './': {},
  //     });
  //     environment.addUsers(1, true);
  //     const workbookModel = new WorkbookModel('./test.json', 'test0');
  //     ClassConverter.saveJson(testWorkbook, './');
  //     const id = environment.dataRepo.workbookRepo.save(workbookModel);
  //     const request = {
  //       login: 'test0',
  //       workbookID: id,
  //     };
  //     assert.strictEqual(workbookHandler.delete(request, {}).response, 200);
  //     mock.restore();
  //   });
  // });
});
