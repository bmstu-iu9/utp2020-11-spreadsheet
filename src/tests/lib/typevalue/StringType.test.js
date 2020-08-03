import * as assert from 'assert';
import ST from '../../../lib/typevalue/StringType.js';
import NT from '../../../lib/typevalue/NumberType.js';

describe('StringType', () => {
  describe('#constructor()', () => {
    it('should make new element', () => {
      assert.deepStrictEqual(new ST('s123').value, 's123');
    });
  });
  describe('#sum()', () => {
    it('should calculate valid sum', () => {
      assert.deepStrictEqual(new ST('love').sum(new ST('iu')), new ST('loveiu'));
    });
    it('should calculate invalid sum', () => {
      assert.throws(() => {
        new ST('123').sum(new NT(5));
      }, (err) => {
        assert.strictEqual(err.name, 'TypeError');
        return true;
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
      }, (err) => {
        assert.strictEqual(err.name, 'TypeError');
        return true;
      });
    });
  });
  describe('#greaterEqual()', () => {
    it('should calculate valid greater or equal', () => {
      assert.deepStrictEqual(new ST('love').greaterEqual(new ST('iu')), true);
      assert.deepStrictEqual(new ST('123').greaterEqual(new ST('123')), true);
      assert.deepStrictEqual(new ST('12').greaterEqual(new ST('123')), false);
    });
    it('should calculate invalid greater or equal', () => {
      assert.throws(() => {
        new ST('123').greaterEqual(new NT(5));
      }, (err) => {
        assert.strictEqual(err.name, 'TypeError');
        return true;
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
      }, (err) => {
        assert.strictEqual(err.name, 'TypeError');
        return true;
      });
    });
  });
  describe('#lessEqual()', () => {
    it('should calculate valid less or equal', () => {
      assert.deepStrictEqual(new ST('love').lessEqual(new ST('iu')), false);
      assert.deepStrictEqual(new ST('123').lessEqual(new ST('123')), true);
      assert.deepStrictEqual(new ST('12').lessEqual(new ST('123')), true);
    });
    it('should calculate invalid less or equal', () => {
      assert.throws(() => {
        new ST('123').lessEqual(new NT(5));
      }, (err) => {
        assert.strictEqual(err.name, 'TypeError');
        return true;
      });
    });
  });
  describe('#less()', () => {
    it('should calculate valid less', () => {
      assert.deepStrictEqual(new ST('love').less(new ST('iu')), false);
      assert.deepStrictEqual(new ST('12').less(new ST('123')), true);
    });
    it('should calculate invalid less', () => {
      assert.throws(() => {
        new ST('123').less(new NT(5));
      }, (err) => {
        assert.strictEqual(err.name, 'TypeError');
        return true;
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
      }, (err) => {
        assert.strictEqual(err.name, 'TypeError');
        return true;
      });
    });
  });
});
