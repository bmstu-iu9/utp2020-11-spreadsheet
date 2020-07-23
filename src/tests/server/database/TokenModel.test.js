import * as assert from 'assert';
import TokenModel from '../../../server/database/TokenModel.js';

describe('TokenModel', () => {
  describe('#isUuidValid()', () => {
    const testCases = [
      {
        uuid: 'efe926c9-b247-4768-a185-9de4cfc58012',
        expected: true,
      },
      {
        uuid: '74b5077d-6dca-4d69-876f-22dafe6440be',
        expected: true,
      },
      {
        uuid: '74b5077d-6dca-4d69-876f-22dafe6440b',
        expected: false,
      },
      {
        uuid: '74b5077d-6dca-4d69-876f-22dafe6440bee',
        expected: false,
      },
    ];
    testCases.forEach((testCase) => {
      const description = `should return ${testCase.expected} for ${testCase.uuid}`;
      it(description, () => {
        assert.strictEqual(TokenModel.isUuidValid(testCase.uuid), testCase.expected);
      });
    });
  });
  describe('#constructor()', () => {
    it('should create token for test user', () => {
      const token = new TokenModel('test');
      assert.strictEqual(token.login, 'test');
      const isUuidValid = TokenModel.isUuidValid(token.uuid);
      assert.strictEqual(isUuidValid, true);
    });
  });
  describe('#setLogin()', () => {
    it('should set login test', () => {
      const token = new TokenModel('f');
      token.setLogin('test');
      assert.strictEqual(token.login, 'test');
    });
    it('should throw an exception for incorrect login', () => {
      const token = new TokenModel('test');
      assert.throws(() => {
        token.setLogin('');
      });
    });
  });
  describe('#setUuid()', () => {
    it('should set UUID efe926c9-b247-4768-a185-9de4cfc58012', () => {
      const token = new TokenModel('test');
      const uuid = 'efe926c9-b247-4768-a185-9de4cfc58012';
      token.setUuid(uuid);
      assert.strictEqual(token.uuid, uuid);
    });
    it('should throw an exception for incorrect UUID', () => {
      const token = new TokenModel('test');
      assert.throws(() => {
        token.setUuid('');
      });
    });
  });
});
