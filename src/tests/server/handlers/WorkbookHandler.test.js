import express from 'express';
import request from 'supertest';
import fs from 'fs';
import WorkbookSaver from '../../../server/save/WorkbookSaver.js';
import WorkbookHandler from '../../../server/handlers/WorkbookHandler.js';
import WorkbookModel from '../../../server/database/WorkbookModel.js';
import TestEnvironment from '../database/TestEnvironment.js';
import Authorizer from '../../../server/authorization/Authorizer.js';
import TokenAuthenticator from '../../../server/authorization/TokenAuthenticator.js';
import HeaderMatcher from '../../../server/authorization/HeaderMatcher.js';
import WorkbookSerializer from '../../../lib/serialization/WorkbookSerializer.js';
import WorkbookLoader from '../../../server/save/WorkbookLoader.js';
import WorkbookPathGenerator from '../../../server/save/WorkbookPathGenerator.js';

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
    workbookHandler = new WorkbookHandler(environment.dataRepo, {
      pathToWorkbooks: '.',
    });
    environment.init();
    app = express();
    matcher = new HeaderMatcher('authorization', 'Token ');
    authenticator = new TokenAuthenticator(matcher, environment.dataRepo);
    authorizer = new Authorizer(authenticator);
    app.use(authorizer.getMiddleware());
    const serialized = WorkbookSerializer.serialize(testWorkbook);
    const generator = new WorkbookPathGenerator('.');
    const saver = new WorkbookSaver(generator);
    saver.save(serialized, 1);
  });
  afterEach(() => {
    TestEnvironment.destroyInstance();
    if (fs.existsSync('./1.json')) {
      fs.unlinkSync('./1.json');
    }
  });
  describe('#get()', () => {
    it('should give response 200 and array of books', (done) => {
      environment.addUsers(1, true);
      const { username, token } = environment.userTokens[0];
      app.get('/workbook/get', (req, res) => {
        workbookHandler.get(req, res);
      });
      const workbookModel = new WorkbookModel(username);
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
      const pathGenerator = new WorkbookPathGenerator('.');
      const loader = new WorkbookLoader(pathGenerator);
      const obj = loader.load(1);
      request(app)
        .post('/workbook/post/.')
        .send(obj)
        .expect(401, done);
    });
    it('should give response 400 for creating book without book', (done) => {
      environment.addUsers(1, true);
      const { token } = environment.userTokens[0];
      app.post('/workbook/post', (req, res) => {
        workbookHandler.post(req, res);
      });
      request(app)
        .post('/workbook/post')
        .set('Authorization', `Token ${token.uuid}`)
        .expect(400, done);
    });
    it('should give response 200 and object', (done) => {
      environment.addUsers(1, true);
      const { token } = environment.userTokens[0];
      app.use(express.json());
      app.post('/workbook/post', (req, res) => {
        workbookHandler.post(req, res);
      });
      const pathGenerator = new WorkbookPathGenerator('.');
      const loader = new WorkbookLoader(pathGenerator);
      const obj = loader.load(1);
      request(app)
        .post('/workbook/post')
        .set('Authorization', `Token ${token.uuid}`)
        .send(obj)
        .expect(200, done);
    });
  });
});
