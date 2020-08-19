import * as assert from 'assert';
import TokenModel from '../../../server/database/TokenModel.js';
import FormatError from '../../../lib/errors/FormatError.js';
import UuidValidator from '../../../lib/uuid/UuidValidator.js';

describe('TokenModel', () => {
  describe('#constructor()', () => {
    it('should create token for test user', () => {
      const token = new TokenModel('test');
      assert.strictEqual(token.login, 'test');
      const isUuidValid = UuidValidator.isUuidValid(token.uuid);
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
      }, FormatError);
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
      }, FormatError);
    });
  });
});
