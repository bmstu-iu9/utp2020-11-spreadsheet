import assert from 'assert';
import Authorizer from '../../../server/authorization/Authorizer.js';
import TokenAuthenticator from '../../../server/authorization/TokenAuthenticator.js';
import TestEnvironment from '../database/TestEnvironment.js';
import HeaderMatcher from '../../../server/authorization/HeaderMatcher.js';

describe('Authorizer', () => {
  let environment;

  beforeEach(() => {
    environment = TestEnvironment.getInstance();
  });

  afterEach(() => {
    TestEnvironment.destroyInstance();
  });

  const getTestAuthenticator = () => {
    const matcher = new HeaderMatcher('Authorization', 'Token ');
    const authenticator = new TokenAuthenticator(matcher, environment.dataRepo);
    return authenticator;
  };

  const getTestMiddleware = () => {
    const authorizer = new Authorizer(getTestAuthenticator());
    return authorizer.getMiddleware();
  };

  describe('#constructor()', () => {
    it('should create object with the same authenticator', () => {
      const authenticator = getTestAuthenticator();
      const authorizer = new Authorizer(authenticator);
      assert.deepStrictEqual(authorizer.authenticator, authenticator);
    });
  });
  describe('#getMiddleware()', () => {
    it('should return function with 3 arguments', () => {
      const middleware = getTestMiddleware();
      assert.strictEqual(middleware.length, 3);
    });
    it('should return function, that calls next', () => {
      let called = false;
      const next = () => {
        called = true;
      };
      const middleware = getTestMiddleware();
      const request = { headers: {} };
      middleware(request, {}, next);
      assert.strictEqual(called, true);
    });
    it('should return function, that adds user to request', () => {
      environment.init();
      environment.addUsers(1, true);
      const { username, token } = environment.userTokens[0];
      const middleware = getTestMiddleware();
      const request = {
        headers: {
          Authorization: `Token ${token.uuid}`,
        },
      };
      middleware(request, {}, () => { });
      assert.strictEqual(request.user.login, username);
    });
    it('should return function, that does not change empty request', () => {
      const authorizer = new Authorizer(getTestAuthenticator());
      const middleware = authorizer.getMiddleware();
      const request = { headers: {} };
      const requestCopy = {
        ...request,
      };
      middleware(requestCopy, {}, () => { });
      assert.deepEqual(requestCopy, request);
    });
  });
});
