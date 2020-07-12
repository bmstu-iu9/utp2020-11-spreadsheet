import * as assert from 'assert';
import ST from '../../../lib/typevalue/StringType.js';
import NT from '../../../lib/typevalue/NumberType.js';

describe('StringType', () => {
  describe('#constructor()', () => {
    it('should make new element', () => {
      assert.deepEqual(new ST('123').value, '123');
      assert.deepEqual(new ST('231').value, '231');
      assert.deepEqual(new ST('312').value, '312');
    });
  });
  describe('#sum()', () => {
    it('should calculate valid sum', () => {
      assert.deepEqual(new ST('love').sum(new ST('iu')), new ST('loveiu'));
      assert.deepEqual(new ST('231').sum(new ST('45')), new ST('23145'));
      assert.deepEqual(new ST('312').sum(new ST('45')), new ST('31245'));
    });
    it('should calculate invalid sum', () => {
      assert.throws(() => {
        new ST('123').sum(new NT(5));
      });
      assert.throws(() => {
        new ST('5').sum(new NT(0));
      });
      assert.throws(() => {
        new ST('hi').sum(new NT(-7));
      });
    });
  });
});
