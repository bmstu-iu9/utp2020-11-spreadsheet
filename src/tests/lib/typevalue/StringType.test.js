import * as assert from 'assert';
import ST from '../../../lib/typevalue/StringType.js';
import NT from '../../../lib/typevalue/NumberType.js';

describe('StringType', () => {
  describe('#constructor()', () => {
    it('should make new element', () => {
      assert.deepStrictEqual(new ST('123').value, '123');
      assert.deepStrictEqual(new ST('231').value, '231');
      assert.deepStrictEqual(new ST('312').value, '312');
    });
  });
  describe('#sum()', () => {
    it('should calculate valid sum', () => {
      assert.deepStrictEqual(new ST('love').sum(new ST('iu')), new ST('loveiu'));
      assert.deepStrictEqual(new ST('231').sum(new ST('45')), new ST('23145'));
      assert.deepStrictEqual(new ST('312').sum(new ST('45')), new ST('31245'));
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
  describe('#equal()', () => {
    it('should calculate valid equal', () => {
      assert.deepStrictEqual(new ST('love').equal(new ST('iu')), false);
      assert.deepStrictEqual(new ST('123').equal(new ST('123')), true);
    });
    it('should calculate invalid equal', () => {
      assert.throws(() => {
        new ST('123').equal(new NT(5));
      });
    });
  });
  describe('#greaterEqual()', () => {
    it('should calculate valid greater or equal', () => {
      assert.deepStrictEqual(new ST('love').greaterEqual(new ST('iu')), true);
      assert.deepStrictEqual(new ST('123').greaterEqual(new ST('123')), true);
    });
    it('should calculate invalid greater or equal', () => {
      assert.throws(() => {
        new ST('123').greaterEqual(new NT(5));
      });
    });
  });
  describe('#greater()', () => {
    it('should calculate valid greater', () => {
      assert.deepStrictEqual(new ST('love').greater(new ST('iu')), true);
      assert.deepStrictEqual(new ST('123').greater(new ST('123')), false);
    });
    it('should calculate invalid greater', () => {
      assert.throws(() => {
        new ST('123').greater(new NT(5));
      });
    });
  });
  describe('#lessEqual()', () => {
    it('should calculate valid less or equal', () => {
      assert.deepStrictEqual(new ST('love').lessEqual(new ST('iu')), false);
      assert.deepStrictEqual(new ST('123').lessEqual(new ST('123')), true);
    });
    it('should calculate invalid less or equal', () => {
      assert.throws(() => {
        new ST('123').lessEqual(new NT(5));
      });
    });
  });
  describe('#less()', () => {
    it('should calculate valid less', () => {
      assert.deepStrictEqual(new ST('love').less(new ST('iu')), false);
      assert.deepStrictEqual(new ST('123').less(new ST('123')), false);
    });
    it('should calculate invalid less', () => {
      assert.throws(() => {
        new ST('123').less(new NT(5));
      });
    });
  });
  describe('#notEqual()', () => {
    it('should calculate valid not equal', () => {
      assert.deepStrictEqual(new ST('love').notEqual(new ST('iu')), true);
      assert.deepStrictEqual(new ST('123').notEqual(new ST('123')), false);
    });
    it('should calculate invalid not equal', () => {
      assert.throws(() => {
        new ST('123').notEqual(new NT(5));
      });
    });
  });
});
