import * as assert from 'assert';
import UnauthorizedError from '../../../lib/errors/UnanuthorizedError.js';

describe('Unauthorized', () => {
  it('should be a child of Error', () => {
    const error = new UnauthorizedError('');
    assert.strictEqual(error instanceof Error, true);
  });

  describe('#constructor()', () => {
    it('should create object with correct fields', () => {
      const message = 'test';
      const error = new UnauthorizedError(message);
      assert.strictEqual(error.message, message);
      assert.strictEqual(error.name, 'UnauthorizedError');
    });
  });
});
