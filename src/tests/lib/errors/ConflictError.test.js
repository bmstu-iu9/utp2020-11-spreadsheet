import * as assert from 'assert';
import ConflictError from '../../../lib/errors/ConflictError.js';

describe('ConflictError', () => {
  const error = new ConflictError();

  it('should be a child of Error', () => {
    assert.strictEqual(error instanceof Error, true);
  });

  describe('#constructor()', () => {
    it('should have name ConflictError', () => {
      assert.strictEqual(error.name, 'ConflictError');
    });
  });
});
