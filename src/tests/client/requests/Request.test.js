import * as assert from 'assert';
import RequestAuthorizer from '../../../client/js/requests/RequestAuthorizer.js';
import Request from '../../../client/js/requests/Request.js';
import UnauthorizedError from '../../../lib/errors/UnanuthorizedError.js';
import UnknownServerError from '../../../lib/errors/UnknownServerError.js';
import FormatError from '../../../lib/errors/FormatError.js';
import ForbiddenError from '../../../lib/errors/ForbiddenError.js';
import NotFoundError from '../../../lib/errors/NotFoundError.js';
import MethodNotAllowedError from '../../../lib/errors/MethodNotAllowedError.js';
import ConflictError from '../../../lib/errors/ConflictError.js';

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
  describe('#validateStatusCode()', () => {
    const testCases = [
      {
        code: 400,
        error: FormatError,
      },
      {
        code: 401,
        error: UnauthorizedError,
      },
      {
        code: 403,
        error: ForbiddenError,
      },
      {
        code: 404,
        error: NotFoundError,
      },
      {
        code: 405,
        error: MethodNotAllowedError,
      },
      {
        code: 409,
        error: ConflictError,
      },
      {
        code: 500,
        error: UnknownServerError,
      },
    ];
    testCases.forEach((test) => {
      it(`should throw ${test.error.name} for ${test.code}`, () => {
        assert.throws(() => {
          Request.validateStatusCode(test.code);
        }, test.error);
      });
    });
    it('should not throw an error for 200', () => {
      assert.doesNotThrow(() => {
        Request.validateStatusCode(200);
      });
    });
  });
});
