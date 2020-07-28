import * as assert from 'assert';
import TokenAuthenticator from '../../../server/authorization/TokenAuthenticator.js';
import HeaderMatcher from '../../../server/authorization/HeaderMatcher.js';
import TestEnvironment from '../database/TestEnvironment.js';

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
        matcher, environment.dataRepo,
      );
      assert.deepStrictEqual(handler.matcher, matcher);
      assert.deepStrictEqual(handler.dataRepo, environment.dataRepo);
    });
    it('should throw an exception for non-HeaderMatcher', () => {
      assert.throws(() => {
        new TokenAuthenticator({}, environment.dataRepo);
      });
    });
    it('should throw an exception for non-DataRepo', () => {
      assert.throws(() => {
        new TokenAuthenticator(new HeaderMatcher('', ''), {});
      });
    });
  });
  describe('#authenticate()', () => {
    it('should throw an exception for empty headers', () => {
      const matcher = new HeaderMatcher('', '');
      const handler = new TokenAuthenticator(
        matcher, environment.dataRepo,
      );
      assert.throws(() => {
        handler.authenticate({ headers: {} });
      });
    });
    it('should return test user', () => {
      environment.init();
      environment.addUsers(1, true);
      const matcher = new HeaderMatcher('Authorization', 'Token ');
      const handler = new TokenAuthenticator(
        matcher, environment.dataRepo,
      );
      const { uuid } = environment.userTokens[0].token;
      const user = handler.authenticate({
        headers: {
          Authorization: `Token ${uuid}`,
        },
      });
      assert.strictEqual(user.login, environment.userTokens[0].username);
    });
  });
});
