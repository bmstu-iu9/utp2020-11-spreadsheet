import * as assert from 'assert';
import ForbiddenError from '../../../lib/errors/ForbiddenError.js';

describe('ForbiddenError', () => {
  const error = new ForbiddenError();

  it('should be a child of Error', () => {
    assert.strictEqual(error instanceof Error, true);
  });
  describe('#constructor()', () => {
    it('should have name = ForbiddenError', () => {
      assert.strictEqual(error.name, 'ForbiddenError');
    });
  });
});
