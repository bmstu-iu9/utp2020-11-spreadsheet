import * as assert from 'assert';
import WrongSecondPasswordError from '../../../lib/errors/WrongSecondPasswordError.js';

describe('WrongSecondPasswordError', () => {
  const error = new WrongSecondPasswordError();

  it('should be a child of Error', () => {
    assert.strictEqual(error instanceof Error, true);
  });

  describe('#constructor()', () => {
    it('should have name WrongSecondPasswordError', () => {
      assert.strictEqual(error.name, 'WrongSecondPasswordError');
    });
  });
});
