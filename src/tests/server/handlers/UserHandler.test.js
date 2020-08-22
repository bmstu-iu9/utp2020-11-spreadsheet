import * as assert from 'assert';
import express from 'express';
import request from 'supertest';
import TestEnvironment from '../database/TestEnvironment.js';
import UserModel from '../../../server/database/UserModel.js';
import UserHandler from '../../../server/handlers/UserHandler.js';
import HeaderMatcher from '../../../server/authorization/HeaderMatcher.js';
import TokenAuthenticator from '../../../server/authorization/TokenAuthenticator.js';
import Authorizer from '../../../server/authorization/Authorizer.js';
import SaveSystem from '../../../server/save/SaveSystem.js';

describe('UserHandler', () => {
  let environment;
  let userHandler;
  let app;
  const saveSystem = new SaveSystem('.', '.');

  beforeEach(() => {
    environment = TestEnvironment.getInstance();
    userHandler = new UserHandler(environment.dataRepo, saveSystem);
    environment.init();
    app = express();
    app.use(express.json());
  });
  afterEach(() => {
    TestEnvironment.destroyInstance();
  });
  describe('#post', () => {
    it('should give response 200 and user data', () => {
      app.post('/user/post', (req, res) => {
        userHandler.post(req, res);
      });
      return request(app)
        .post('/user/post')
        .send({
          username: 'login',
          password: '1234567',
        })
        .expect(200)
        .then((response) => {
          assert.deepStrictEqual(response.body.username, 'login');
          assert.deepStrictEqual(response.body.isAdmin, false);
        })
        .then(() => {
          assert.notDeepStrictEqual(environment.dataRepo.userRepo.get('login'), undefined);
        });
    });
    it('should give response 403 because of reserved login', () => {
      const user = new UserModel('login', '1234567', false);
      environment.dataRepo.userRepo.save(user);
      app.post('/user/post', (req, res) => {
        userHandler.post(req, res);
      });
      return request(app)
        .post('/user/post')
        .send({
          username: 'login',
          password: '12345678',
        })
        .expect(409);
    });
    it('should give response 400 because of incorrect password', () => {
      app.post('/user/post', (req, res) => {
        userHandler.post(req, res);
      });
      return request(app)
        .post('/user/post')
        .send({
          username: 'login',
          password: '123',
        })
        .expect(400);
    });
    it('should give response 400 because of invalid data', () => {
      app.post('/user/post', (req, res) => {
        userHandler.post(req, res);
      });
      return request(app)
        .post('/user/post')
        .expect(400);
    });
  });
  describe('#get', () => {
    beforeEach(() => {
      const matcher = new HeaderMatcher('authorization', 'Token ');
      const authenticator = new TokenAuthenticator(matcher, environment.dataRepo);
      const authorizer = new Authorizer(authenticator);
      app.use(authorizer.getMiddleware());
      app.get('/user/get', (req, res) => {
        userHandler.get(req, res);
      });
    });
    it('should give response 200 and list of users', () => {
      environment.addUsers(2, true);
      const { token } = environment.userTokens[1];
      return request(app)
        .get('/user/get')
        .set('Authorization', `Token ${token.uuid}`)
        .expect(200)
        .then((response) => {
          assert.deepStrictEqual(response.body, [{
            isAdmin: false,
            username: 'test0',
          },
          {
            isAdmin: true,
            username: 'test2',
          }]);
        });
    });
    it('should give response 403 because of lack of rights', () => {
      environment.addUsers(2, true);
      const { token } = environment.userTokens[0];
      return request(app)
        .get('/user/get')
        .set('Authorization', `Token ${token.uuid}`)
        .expect(403);
    });
    it('should give response 401 because of unauthorized', () => request(app)
      .get('/user/get')
      .expect(401));
  });
});
