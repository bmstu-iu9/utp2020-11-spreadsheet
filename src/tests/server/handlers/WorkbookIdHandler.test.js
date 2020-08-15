import * as assert from 'assert';
import express from 'express';
import request from 'supertest';
import mock from 'mock-fs';
import Workbook from '../../../lib/spreadsheets/Workbook.js';
import HeaderMatcher from '../../../server/authorization/HeaderMatcher.js';
import TokenAuthencticator from '../../../server/authorization/TokenAuthenticator.js';
import Authorizer from '../../../server/authorization/Authorizer.js';
import TestEnvironment from '../database/TestEnvironment.js';
import WorkbookIdHandler from '../../../server/handlers/WorkbookIdHandler.js';
import WorkbookModel from '../../../server/database/WorkbookModel.js';
import WorkbookSaver from '../../../server/save/WorkbookSaver.js';
import WorkbookPathGenerator from '../../../server/save/WorkbookPathGenerator.js';

describe('WorkbookIdHandler', () => {
  let environment;
  let app;

  const createWorkbook = () => {
    environment.addUsers(1, true);
    const { username } = environment.userTokens[0];
    const workbook = new Workbook('test');
    const generator = new WorkbookPathGenerator('.');
    const saver = new WorkbookSaver(generator);
    saver.save(workbook, 1);
    const workbookModel = new WorkbookModel(username);
    environment.dataRepo.workbookRepo.save(workbookModel);
  };

  beforeEach(() => {
    environment = TestEnvironment.getInstance();
    environment.init();
    const handler = new WorkbookIdHandler(environment.dataRepo, {
      pathToWorkbooks: '.',
    });
    const matcher = new HeaderMatcher('authorization', 'Token ');
    const authenticator = new TokenAuthencticator(matcher, environment.dataRepo);
    const authorizer = new Authorizer(authenticator);
    app = express();
    app.use(authorizer.getMiddleware());
    app.get('/:id', (req, res) => handler.get(req, res));
    app.delete('/:id', (req, res) => handler.delete(req, res));
  });
  afterEach(() => {
    TestEnvironment.destroyInstance();
  });

  describe('#get()', () => {
    it('should return 401 for unauthorized request', () => request(app)
      .get('/1')
      .expect(401));
    it('should return 404 if workbook was not found', () => {
      environment.addUsers(1, true);
      const { token } = environment.userTokens[0];
      return request(app)
        .get('/1')
        .set('Authorization', `Token ${token.uuid}`)
        .expect(404);
    });
    it('should return a workbook', () => {
      mock({
        './1.json': '',
      });
      createWorkbook();
      const { token } = environment.userTokens[0];
      return request(app)
        .get('/1')
        .set('Authorization', `Token ${token.uuid}`)
        .expect(200)
        .then((response) => {
          assert.strictEqual(response.body.name, 'test');
          assert.strictEqual(response.body.id, 1);
        })
        .finally(() => {
          mock.restore();
        });
    });
    it('should return 403', () => {
      createWorkbook();
      environment.addUsers(1, true);
      const { token } = environment.userTokens[1];
      return request(app)
        .get('/1')
        .set('Authorization', `Token ${token.uuid}`)
        .expect(403);
    });
  });
  describe('#delete()', () => {
    it('should give response 401 for unauthorized user', (done) => {
      request(app)
        .delete('/123')
        .expect(401, done);
    });
    it('should give response 404 for unfound book', (done) => {
      environment.addUsers(1, true);
      const { token } = environment.userTokens[0];
      request(app)
        .delete('/123')
        .set('Authorization', `Token ${token.uuid}`)
        .expect(404, done);
    });
    it('should give response 403 for deleting book without access permission', (done) => {
      environment.addUsers(2, true);
      const workbookModel = new WorkbookModel('test0');
      const id = environment.dataRepo.workbookRepo.save(workbookModel);
      request(app)
        .delete(`/${id.toString()}`)
        .set('Authorization', `Token ${environment.userTokens[1].token.uuid}`)
        .expect(403, done);
    });
    it('should give response 200 for successful deletion', (done) => {
      environment.addUsers(1, true);
      const workbookModel = new WorkbookModel('test0');
      const id = environment.dataRepo.workbookRepo.save(workbookModel);
      const generator = new WorkbookPathGenerator('.');
      const saver = new WorkbookSaver(generator);
      saver.save(new Workbook('test'), id);
      const { token } = environment.userTokens[0];
      request(app)
        .delete(`/${id.toString()}`)
        .set('Authorization', `Token ${token.uuid}`)
        .expect(200, done);
    });
  });
});
