import * as assert from 'assert';
import TokenAuthenticator from '../../../server/authorization/TokenAuthenticator.js';
import HeaderMatcher from '../../../server/authorization/HeaderMatcher.js';
import TestEnvironment from '../database/TokenRepo/TestEnvironment.js';

describe('TokenAuthenticator', () => {
  let environment;

  beforeEach(() => {
    environment = TestEnvironment.getInstance();
  });
  afterEach(() => {
    TestEnvironment.destroyInstance();
  });

  describe('#constructor()', () => {
    it('should create object with correct properties', () => {
      const matcher = new HeaderMatcher('', '');
      const handler = new TokenAuthenticator(
        matcher, environment.tokenRepo, environment.userRepo,
      );
      assert.strictEqual(handler.matcher, matcher);
    });
    it('should throw an exception for non-HeaderMatcher', () => {
      assert.throws(() => {
        new TokenAuthenticator({}, environment.tokenRepo, environment.userRepo);
      });
    });
    it('should throw an exception for non-TokenRepo', () => {
      assert.throws(() => {
        new TokenAuthenticator(new HeaderMatcher('', ''), {}, environment.userRepo);
      });
    });
    it('should throw an exception for non-UserRepo', () => {
      assert.throws(() => {
        new TokenAuthenticator(new HeaderMatcher('', ''), environment.tokenRepo, {});
      });
    });
  });
  describe('#fetchUserFromHeaders()', () => {
    it('should throw an exception for empty headers', () => {
      const matcher = new HeaderMatcher('', '');
      const handler = new TokenAuthenticator(
        matcher, environment.tokenRepo, environment.userRepo,
      );
      assert.throws(() => {
        handler.fetchUserFromHeaders({});
      });
    });
    it('should return test user', () => {
      environment.init();
      environment.addUsers(1, true);
      const matcher = new HeaderMatcher('Authorization', 'Token ');
      const handler = new TokenAuthenticator(
        matcher, environment.tokenRepo, environment.userRepo,
      );
      const { uuid } = environment.userTokens[0].token;
      const user = handler.fetchUserFromHeaders({
        Authorization: `Token ${uuid}`,
      });
      assert.strictEqual(user.login, environment.userTokens[0].username);
    });
  });
});
