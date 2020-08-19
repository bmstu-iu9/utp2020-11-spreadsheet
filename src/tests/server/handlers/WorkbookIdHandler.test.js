import * as assert from 'assert';
import express from 'express';
import request from 'supertest';
import mock from 'mock-fs';
import { zeroID } from '../../../lib/synchronization/Synchronizer.js';
import Workbook from '../../../lib/spreadsheets/Workbook.js';
import HeaderMatcher from '../../../server/authorization/HeaderMatcher.js';
import TokenAuthencticator from '../../../server/authorization/TokenAuthenticator.js';
import Authorizer from '../../../server/authorization/Authorizer.js';
import TestEnvironment from '../database/TestEnvironment.js';
import WorkbookIdHandler from '../../../server/handlers/WorkbookIdHandler.js';
import WorkbookModel from '../../../server/database/WorkbookModel.js';
import WorkbookIdSerializer from '../../../lib/serialization/WorkbookIdSerializer.js';
import Spreadsheet from '../../../lib/spreadsheets/Spreadsheet.js';
import SaveSystem from '../../../server/save/SaveSystem.js';

describe('WorkbookIdHandler', () => {
  const saveSystem = new SaveSystem('workbooks', 'commits');
  let environment;
  let app;
  const initialCommits = [{ ID: zeroID }];

  const createWorkbook = () => {
    environment.addUsers(1, true);
    const { username } = environment.userTokens[0];
    const workbook = new Workbook('test', [new Spreadsheet('test')]);
    saveSystem.workbookSaver.save(1, workbook);
    const workbookModel = new WorkbookModel(username);
    environment.dataRepo.workbookRepo.save(workbookModel);
  };

  const createCommits = () => {
    saveSystem.commitSaver.save(1, initialCommits);
  };

  beforeEach(() => {
    environment = TestEnvironment.getInstance();
    environment.init();
    const handler = new WorkbookIdHandler(environment.dataRepo, saveSystem);
    const matcher = new HeaderMatcher('authorization', 'Token ');
    const authenticator = new TokenAuthencticator(matcher, environment.dataRepo);
    const authorizer = new Authorizer(authenticator);
    app = express();
    app.use(authorizer.getMiddleware());

    // express.json() does not work correctly with mock-fs
    app.use((req, res, next) => {
      if (req.method !== 'PATCH') {
        next();
        return;
      }
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
      });
      req.on('end', () => {
        req.body = JSON.parse(data);
        next();
      });
    });
    app.patch('/:id', (req, res) => handler.patch(req, res));
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
        workbooks: {
          '1.json': '',
        },
        commits: {
          '1.commits.json': '',
        },
      });
      createWorkbook();
      createCommits();
      const workbook = saveSystem.workbookLoader.load(1);
      const workbookId = WorkbookIdSerializer.serialize(
        workbook, 1, initialCommits[initialCommits.length - 1].ID,
      );
      const { token } = environment.userTokens[0];
      return request(app)
        .get('/1')
        .set('Authorization', `Token ${token.uuid}`)
        .expect(200)
        .then((response) => {
          assert.deepStrictEqual(response.body, workbookId);
        })
        .then(mock.restore);
    });
    it('should return 403', () => {
      mock({
        workbooks: {
          '1.json': '',
        },
      });
      createWorkbook();
      environment.addUsers(1, true);
      const { token } = environment.userTokens[1];
      return request(app)
        .get('/1')
        .set('Authorization', `Token ${token.uuid}`)
        .expect(403)
        .then(mock.restore);
    });
    it('should return commits', () => {
      mock({
        workbooks: {
          '1.json': '',
        },
        commits: {
          '1.commits.json': '',
        },
      });
      createWorkbook();
      const commits = [
        {
          ID: zeroID,
        },
        {
          ID: 'd0aab9a8-152f-434e-b833-b76104503617',
        },
      ];
      const { token } = environment.userTokens[0];
      saveSystem.commitSaver.save(1, commits);
      return request(app)
        .get(`/1?after=${zeroID}`)
        .set('Authorization', `Token ${token.uuid}`)
        .expect(200)
        .then((response) => {
          assert.deepStrictEqual(response.body, commits.slice(1));
        })
        .then(mock.restore);
    });
  });
  it('should return 409 for absent commit', () => {
    mock({
      workbooks: {
        '1.json': '',
      },
      commits: {
        '1.commits.json': JSON.stringify([{ ID: zeroID }]),
      },
    });
    createWorkbook();
    const { token } = environment.userTokens[0];
    return request(app)
      .get('/1?after=6fdc5457-d4bc-4e3e-81ba-bc9f3b49ba7b')
      .set('Authorization', `Token ${token.uuid}`)
      .expect(409)
      .then(mock.restore);
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
    it('should give response 200 for successful deletion', () => {
      mock({
        workbooks: {
          '1.json': '',
        },
      });
      createWorkbook();
      const { token } = environment.userTokens[0];
      return request(app)
        .delete('/1')
        .set('Authorization', `Token ${token.uuid}`)
        .expect(200)
        .then(mock.restore);
    });
  });
  describe('#patch', () => {
    const requestBody = {
      lastSynchronizedCommit: zeroID,
      changes: [{
        ID: 'cf3c1cf6-be2f-4a6a-b69b-97b9c1126065',
        changeType: 'color',
        cellAddress: 'A1',
        color: '#aaaaaa',
        page: 0,
      }],
    };

    it('should return 401 for unauthorized request', () => {
      mock({
        workbooks: {
          '1.json': '',
        },
      });
      createWorkbook();
      return request(app).patch('/1').send({}).expect(401)
        .then(mock.restore);
    });
    it('should save commits and return 200', () => {
      mock({
        workbooks: {
          '1.json': '',
        },
        commits: {
          '1.commits.json': '',
        },
      });
      createWorkbook();
      createCommits();
      const { token } = environment.userTokens[0];
      return request(app)
        .patch('/1')
        .set('Authorization', `Token ${token.uuid}`)
        .send(JSON.stringify(requestBody))
        .expect(200)
        .then(() => {
          const actualCommits = saveSystem.commitLoader.load(1);
          assert.deepStrictEqual(actualCommits[1], requestBody.changes[0]);
        })
        .then(() => {
          const workbook = saveSystem.workbookLoader.load(1);
          assert.strictEqual(workbook.spreadsheets[0].cells.get('A1').color, '#aaaaaa');
        })
        .then(mock.restore);
    });
    it('should return 400 for incorrect commits', () => {
      mock({
        workbooks: {
          '1.json': '',
        },
        commits: {
          '1.commits.json': '',
        },
      });
      createWorkbook();
      createCommits();
      const { token } = environment.userTokens[0];
      return request(app)
        .patch('/1')
        .set('Authorization', `Token ${token.uuid}`)
        .send('{}')
        .expect(400)
        .then(mock.restore);
    });
    it('should return 409 for conflicting commits', () => {
      mock({
        workbooks: {
          '1.json': '',
        },
        commits: {
          '1.commits.json': '',
        },
      });
      createWorkbook();
      saveSystem.commitSaver.save(1, [
        { ID: zeroID },
        ...requestBody.changes,
      ]);
      const { token } = environment.userTokens[0];
      return request(app)
        .patch('/1')
        .set('Authorization', `Token ${token.uuid}`)
        .send(JSON.stringify(requestBody))
        .expect(409)
        .then((res) => {
          assert.deepStrictEqual(res.body, requestBody.changes);
        })
        .then(mock.restore);
    });
  });
});
