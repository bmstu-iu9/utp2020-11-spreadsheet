import * as assert from 'assert';
import BT from '../../../lib/typevalue/BooleanType.js';

describe('BooleanType', () => {
  describe('#constructor()', () => {
    it('should make new element', () => {
      assert.deepStrictEqual(new BT(true).value, true);
      assert.deepStrictEqual(new BT(false).value, false);
    });
  });
  describe('#makeTypeError()', () => {
    it('should make error', () => {
      assert.throws(() => {
        BT.makeTypeError('makeTypeError');
      });
    });
  });
});
