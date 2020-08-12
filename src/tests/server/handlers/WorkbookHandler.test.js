import express from 'express';
import request from 'supertest';
import fs from 'fs';
import WorkbookHandler from '../../../server/handlers/WorkbookHandler.js';
import WorkbookSerializer from '../../../server/serialization/WorkbookSerializer.js';
import WorkbookDeserializer from '../../../server/serialization/WorkbookDeserializer.js';
import WorkbookModel from '../../../server/database/WorkbookModel.js';
import TestEnvironment from '../database/TestEnvironment.js';
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

describe('WorkbookHandler', () => {
  let environment;
  let workbookHandler;
  let matcher;
  let authenticator;
  let authorizer;
  let app;

  beforeEach(() => {
    environment = TestEnvironment.getInstance();
    workbookHandler = new WorkbookHandler(environment.dataRepo);
    environment.init();
    app = express();
    matcher = new HeaderMatcher('authorization', 'Token ');
    authenticator = new TokenAuthenticator(matcher, environment.dataRepo);
    authorizer = new Authorizer(authenticator);
    app.use(authorizer.getMiddleware());
    WorkbookSerializer.saveJson(testWorkbook, '.');
  });
  afterEach(() => {
    TestEnvironment.destroyInstance();
    if (fs.existsSync('./test.json')) {
      fs.unlinkSync('./test.json');
    }
  });
  describe('#get()', () => {
    it('should give response 200 and array of books', (done) => {
      environment.addUsers(1, true);
      const { username, token } = environment.userTokens[0];
      app.get('/workbook/get', (req, res) => {
        workbookHandler.get(req, res);
      });
      const workbookModel = new WorkbookModel('./test.json', username);
      environment.dataRepo.workbookRepo.save(workbookModel);
      request(app)
        .get('/workbook/get')
        .set('Authorization', `Token ${token.uuid}`)
        .expect(200, done);
    });
    it('should give response 404 for no books', (done) => {
      environment.addUsers(1, true);
      const { token } = environment.userTokens[0];
      app.get('/workbook/get', (req, res) => {
        workbookHandler.get(req, res);
      });
      request(app)
        .get('/workbook/get')
        .set('Authorization', `Token ${token.uuid}`)
        .expect(404, done);
    });
    it('should give response 401 for getting books without login', (done) => {
      app.get('/workbook/get', (req, res) => {
        workbookHandler.get(req, res);
      });
      request(app)
        .get('/workbook/get')
        .expect(401, done);
    });
  });
  describe('#post()', () => {
    it('should give response 401 for creating book without user', (done) => {
      app.use(express.json());
      app.post('/workbook/post/:pathToWorkbooks', (req, res) => {
        workbookHandler.post(req, res);
      });
      const obj = WorkbookSerializer.readObject(WorkbookDeserializer.readWorkbook('test.json'));
      request(app)
        .post('/workbook/post/.')
        .send(obj)
        .expect(401, done);
    });
    it('should give response 400 for creating book without book', (done) => {
      environment.addUsers(1, true);
      const { token } = environment.userTokens[0];
      app.post('/workbook/post/:pathToWorkbooks', (req, res) => {
        workbookHandler.post(req, res);
      });
      request(app)
        .post('/workbook/post/.')
        .set('Authorization', `Token ${token.uuid}`)
        .expect(400, done);
    });
    it('should give response 200 and object', (done) => {
      environment.addUsers(1, true);
      const { token } = environment.userTokens[0];
      app.use(express.json());
      app.post('/workbook/post/:pathToWorkbooks', (req, res) => {
        workbookHandler.post(req, res);
      });
      const obj = WorkbookSerializer.readObject(WorkbookDeserializer.readWorkbook('test.json'));
      request(app)
        .post('/workbook/post/.')
        .set('Authorization', `Token ${token.uuid}`)
        .send(obj)
        .expect(200, done);
    });
  });
  describe('#delete()', () => {
    it('should give response 401 for unauthorized user', (done) => {
      app.delete('/workbook/delete/:workbookID', (req, res) => {
        workbookHandler.delete(req, res);
      });
      request(app)
        .delete('/workbook/delete/123')
        .expect(401, done);
    });
    it('should give response 404 for unfound book', (done) => {
      environment.addUsers(1, true);
      const { token } = environment.userTokens[0];
      app.get('/workbook/delete/:workbookID', (req, res) => {
        workbookHandler.delete(req, res);
      });
      request(app)
        .get('/workbook/delete/123')
        .set('Authorization', `Token ${token.uuid}`)
        .expect(404, done);
    });
    it('should give response 403 for deleting book without access permission', (done) => {
      environment.addUsers(2, true);
      const workbookModel = new WorkbookModel('./test.json', 'test0');
      const id = environment.dataRepo.workbookRepo.save(workbookModel);
      app.get('/workbook/delete/:workbookID', (req, res) => {
        workbookHandler.delete(req, res);
      });
      request(app)
        .get(`/workbook/delete/${id.toString()}`)
        .set('Authorization', `Token ${environment.userTokens[1].token.uuid}`)
        .expect(403, done);
    });
    it('should give response 200 for successful deletion', (done) => {
      environment.addUsers(1, true);
      const workbookModel = new WorkbookModel('test.json', 'test0');
      const id = environment.dataRepo.workbookRepo.save(workbookModel);
      const { token } = environment.userTokens[0];
      app.get('/workbook/delete/:workbookID', (req, res) => {
        workbookHandler.delete(req, res);
      });
      request(app)
        .get(`/workbook/delete/${id.toString()}`)
        .set('Authorization', `Token ${token.uuid}`)
        .expect(200, done);
    });
  });
});
