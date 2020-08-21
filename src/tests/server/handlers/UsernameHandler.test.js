import * as assert from 'assert';
import express from 'express';
import request from 'supertest';
import TestEnvironment from '../database/TestEnvironment.js';
import HeaderMatcher from '../../../server/authorization/HeaderMatcher.js';
import TokenAuthenticator from '../../../server/authorization/TokenAuthenticator.js';
import Authorizer from '../../../server/authorization/Authorizer.js';
import UsernameHandler from '../../../server/handlers/UsernameHandler.js';

describe('UsernameHandler', () => {
  let environment;
  let usernameHandler;
  let app;

  beforeEach(() => {
    environment = TestEnvironment.getInstance();
    usernameHandler = new UsernameHandler(environment.dataRepo, {});
    environment.init();
    app = express();
    app.use(express.json());
    const matcher = new HeaderMatcher('authorization', 'Token ');
    const authenticator = new TokenAuthenticator(matcher, environment.dataRepo);
    const authorizer = new Authorizer(authenticator);
    app = express();
    app.use(authorizer.getMiddleware());
  });
  afterEach(() => {
    TestEnvironment.destroyInstance();
  });

  describe('#get', () => {
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
    it('should give response 401 because of unauthorized', () => request(app)
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
});
