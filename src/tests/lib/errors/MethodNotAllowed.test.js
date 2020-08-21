import * as assert from 'assert';
import MethodNotAllowedError from '../../../lib/errors/MethodNotAllowedError.js';

describe('MethodNotAllowedError', () => {
  const error = new MethodNotAllowedError();

  it('should be a child of Error', () => {
    assert.strictEqual(error instanceof Error, true);
  });

  describe('#constructor()', () => {
    it('should have name MethodNotAllowedError', () => {
      assert.strictEqual(error.name, 'MethodNotAllowedError');
    });
  });
});
