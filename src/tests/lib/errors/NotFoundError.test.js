import * as assert from 'assert';
import NotFoundError from '../../../lib/errors/NotFoundError.js';

describe('NotFoundError', () => {
  const error = new NotFoundError();

  it('should be a child of Error', () => {
    assert.strictEqual(error instanceof Error, true);
  });

  describe('#constructor()', () => {
    it('should have name NotFoundError', () => {
      assert.strictEqual(error.name, 'NotFoundError');
    });
  });
});
