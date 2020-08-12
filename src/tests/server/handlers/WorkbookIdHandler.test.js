import * as assert from 'assert';
import express from 'express';
import request from 'supertest';
import mock from 'mock-fs';
import Workbook from '../../../lib/spreadsheets/Workbook.js';
import ClassConverter from '../../../lib/saveWorkbook/ClassConverter.js';
import HeaderMatcher from '../../../server/authorization/HeaderMatcher.js';
import TokenAuthencticator from '../../../server/authorization/TokenAuthenticator.js';
import Authorizer from '../../../server/authorization/Authorizer.js';
import TestEnvironment from '../database/TestEnvironment.js';
import WorkbookIdHandler from '../../../server/handlers/WorkbookIdHandler.js';
import WorkbookModel from '../../../server/database/WorkbookModel.js';

describe('WorkbookIdHandler', () => {
  let environment;
  let app;

  beforeEach(() => {
    environment = TestEnvironment.getInstance();
    const handler = new WorkbookIdHandler(environment.dataRepo);
    const matcher = new HeaderMatcher('authorization', 'Token ');
    const authenticator = new TokenAuthencticator(matcher, environment.dataRepo);
    const authorizer = new Authorizer(authenticator);
    app = express();
    app.use(authorizer.getMiddleware());
    app.get('/:id', (req, res) => handler.get(req, res));
  });
  afterEach(() => {
    TestEnvironment.destroyInstance();
  });

  describe('#get()', () => {
    it('should return 401 for unauthorized request', () => request(app)
      .get('/1')
      .expect(401));
    it('should return 404 if workbook was not found', () => {
      environment.init();
      environment.addUsers(1, true);
      const { token } = environment.userTokens[0];
      return request(app)
        .get('/1')
        .set('Authorization', `Token ${token.uuid}`)
        .expect(404);
    });
    it('should return a workbook', () => {
      mock({
        './test.json': '',
      });
      environment.init();
      environment.addUsers(1, true);
      const { username, token } = environment.userTokens[0];
      const workbook = new Workbook('test');
      ClassConverter.saveJson(workbook, './');
      const workbookModel = new WorkbookModel('./test.json', username);
      environment.dataRepo.workbookRepo.save(workbookModel);
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
  });
});
