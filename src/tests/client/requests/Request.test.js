import * as assert from 'assert';
import RequestAuthorizer from '../../../client/js/requests/RequestAuthorizer.js';
import Request from '../../../client/js/requests/Request.js';

describe('Request', () => {
  const baseUrl = 'https://example.com';
  const authorizer = new RequestAuthorizer('7f0f5923-00f0-4d5f-85b8-03d03ab607d1');

  describe('#constructor()', () => {
    it('should create object with correct fields', () => {
      const requester = new Request(baseUrl, authorizer);
      assert.strictEqual(requester.baseUrl, baseUrl);
      assert.strictEqual(requester.authorizer, authorizer);
    });
    it('should throw an exception for non-string', () => {
      assert.throws(() => {
        new Request(5, authorizer);
      }, TypeError);
    });
    it('should throw an exception for non-authorizer', () => {
      assert.throws(() => {
        new Request(baseUrl, {});
      }, TypeError);
    });
  });
});
