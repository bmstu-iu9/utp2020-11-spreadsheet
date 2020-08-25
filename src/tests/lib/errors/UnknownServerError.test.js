import * as assert from 'assert';
import UnknownServerError from '../../../lib/errors/UnknownServerError.js';

describe('UnknownServerError', () => {
  const error = new UnknownServerError(400);

  it('should be a child of Error', () => {
    assert.strictEqual(error instanceof Error, true);
  });
  describe('#constructor()', () => {
    it('should have name UnknownServerError', () => {
      assert.strictEqual(error.name, 'UnknownServerError');
    });
  });
});
