import * as assert from 'assert';
import express from 'express';
import request from 'supertest';
import TestEnvironment from '../database/TestEnvironment.js';
import HeaderMatcher from '../../../server/authorization/HeaderMatcher.js';
import TokenAuthenticator from '../../../server/authorization/TokenAuthenticator.js';
import Authorizer from '../../../server/authorization/Authorizer.js';
import UsernameHandler from '../../../server/handlers/UsernameHandler.js';
import UserModel from '../../../server/database/UserModel.js';
import SaveSystem from '../../../server/save/SaveSystem.js';

describe('UsernameHandler', () => {
  let environment;
  let usernameHandler;
  let app;
  const saveSystem = new SaveSystem('.', '.');

  beforeEach(() => {
    environment = TestEnvironment.getInstance();
    usernameHandler = new UsernameHandler(environment.dataRepo, saveSystem);
    environment.init();
    app = express();
    app.use(express.json());
    const matcher = new HeaderMatcher('authorization', 'Token ');
    const authenticator = new TokenAuthenticator(matcher, environment.dataRepo);
    const authorizer = new Authorizer(authenticator);
    app.use(authorizer.getMiddleware());
  });
  afterEach(() => {
    TestEnvironment.destroyInstance();
  });

  describe('#get()', () => {
    beforeEach(() => {
      app.get('/user/:username', (req, res) => {
        usernameHandler.get(req, res);
      });
    });
    it('should return 200 and user data', () => {
      environment.addUsers(1, true);
      const { username, token } = environment.userTokens[0];
      return request(app)
        .get(`/user/${username}`)
        .set('Authorization', `Token ${token.uuid}`)
        .expect(200)
        .then((response) => {
          assert.deepStrictEqual(response.body, { isAdmin: false, username });
        });
    });
    it('should give response 401 because of unauthorized request', () => request(app)
      .get('/user/login')
      .expect(401));
    it('should give response 403 because of lack of rights', () => {
      environment.addUsers(2, true);
      const { token } = environment.userTokens[0];
      const { username } = environment.userTokens[1];
      return request(app)
        .get(`/user/${username}`)
        .set('Authorization', `Token ${token.uuid}`)
        .expect(403);
    });
    it('should give response 404 because user is missing', () => {
      environment.addUsers(2, true);
      const { token } = environment.userTokens[1];
      return request(app)
        .get('/user/login')
        .set('Authorization', `Token ${token.uuid}`)
        .expect(404);
    });
  });
  describe('#patch()', () => {
    beforeEach(() => {
      app.patch('/user/:username', (req, res) => {
        usernameHandler.patch(req, res);
      });
    });
    it('should change password, return 200 and user data', () => {
      environment.addUsers(2, true);
      const { username, token } = environment.userTokens[0];
      return request(app)
        .patch(`/user/${username}`)
        .send({ isAdmin: false, password: '1111111' })
        .set('Authorization', `Token ${token.uuid}`)
        .expect(200)
        .then((response) => {
          assert.deepStrictEqual(response.body, { isAdmin: false, username: 'test0' });
        })
        .then(() => {
          const user = environment.dataRepo.userRepo.get('test0');
          assert.deepStrictEqual(user.password, UserModel.getHashedPassword('1111111'));
        });
    });
    it('should change isAdmin, return 200 and user data', () => {
      environment.addUsers(2, true);
      const { token } = environment.userTokens[1];
      const { username } = environment.userTokens[0];
      return request(app)
        .patch(`/user/${username}`)
        .send({ isAdmin: true, password: '1234567' })
        .set('Authorization', `Token ${token.uuid}`)
        .expect(200)
        .then((response) => {
          assert.deepStrictEqual(response.body, { isAdmin: true, username: 'test0' });
        })
        .then(() => {
          const user = environment.dataRepo.userRepo.get('test0');
          assert.deepStrictEqual(Boolean(user.isAdmin), true);
        });
    });
    it('should give response 404 because user is missing', () => {
      environment.addUsers(2, true);
      const { token } = environment.userTokens[1];
      return request(app)
        .patch('/user/login')
        .send({ isAdmin: true, password: '1234567' })
        .set('Authorization', `Token ${token.uuid}`)
        .expect(404);
    });
    it('should give response 401 because of unauthorized request', () => {
      environment.addUsers(1, true);
      const { username } = environment.userTokens[0];
      return request(app)
        .patch(`/user/${username}`)
        .send({ isAdmin: false, password: '1111111' })
        .expect(401);
    });
    it('should give response 400 because of incorrect request', () => {
      environment.addUsers(1, true);
      const { username, token } = environment.userTokens[0];
      return request(app)
        .patch(`/user/${username}`)
        .send({ isAdmin: false, username })
        .set('Authorization', `Token ${token.uuid}`)
        .expect(400);
    });
    it('should give response 403 because of lack of rights', () => {
      environment.addUsers(2, true);
      const { token, username } = environment.userTokens[0];
      return request(app)
        .patch(`/user/${username}`)
        .send({ isAdmin: true, password: '1234567' })
        .set('Authorization', `Token ${token.uuid}`)
        .expect(403);
    });
  });
  describe('#delete()', () => {
    beforeEach(() => {
      app.delete('/user/:username', (req, res) => {
        usernameHandler.delete(req, res);
      });
    });
    it('should delete user and give response 200', () => {
      environment.addUsers(2, true);
      const { token } = environment.userTokens[1];
      const { username } = environment.userTokens[0];
      return request(app)
        .delete(`/user/${username}`)
        .set('Authorization', `Token ${token.uuid}`)
        .expect(200)
        .then(() => {
          assert.deepStrictEqual(environment.dataRepo.userRepo.get(username), undefined);
        });
    });
    it('should give response 401 because of unauthorized request', () => {
      environment.addUsers(2, true);
      const { username } = environment.userTokens[0];
      return request(app)
        .delete(`/user/${username}`)
        .expect(401);
    });
    it('should give response 404 for unfound user', () => {
      environment.addUsers(2, true);
      const { token } = environment.userTokens[1];
      return request(app)
        .delete('/user/login')
        .set('Authorization', `Token ${token.uuid}`)
        .expect(404);
    });
    it('should give response 403 because of lack of rights', () => {
      environment.addUsers(2, true);
      const { token } = environment.userTokens[0];
      const { username } = environment.userTokens[1];
      return request(app)
        .delete(`/user/${username}`)
        .set('Authorization', `Token ${token.uuid}`)
        .expect(403);
    });
  });
});
