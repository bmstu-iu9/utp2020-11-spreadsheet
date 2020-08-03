import * as assert from 'assert';
import ST from '../../../lib/typevalue/StringType.js';
import NT from '../../../lib/typevalue/NumberType.js';

describe('NumberType', () => {
  describe('#constructor()', () => {
    it('should make new element', () => {
      assert.deepStrictEqual(new NT(123).value, 123);
    });
  });
  describe('#sum()', () => {
    it('should calculate valid sum', () => {
      assert.deepStrictEqual(new NT(1234).sum(new NT(3245)), new NT(1234 + 3245));
    });
    it('should calculate invalid sum', () => {
      assert.throws(() => {
        new NT(5).sum(new ST('123'));
      }, (err) => {
        assert.strictEqual(err.name, 'TypeError');
        return true;
      });
    });
  });
  describe('#sub()', () => {
    it('should calculate valid subtraction', () => {
      assert.deepStrictEqual(new NT(1234).sub(new NT(3245)), new NT(1234 - 3245));
    });
    it('should calculate invalid subtraction', () => {
      assert.throws(() => {
        new NT(5).sub(new ST('123'));
      }, (err) => {
        assert.strictEqual(err.name, 'TypeError');
        return true;
      });
    });
  });
  describe('#mul()', () => {
    it('should calculate valid multiplication', () => {
      assert.deepStrictEqual(new NT(1234).mul(new NT(3245)), new NT(1234 * 3245));
    });
    it('should calculate invalid multiplication', () => {
      assert.throws(() => {
        new NT(5).mul(new ST('123'));
      }, (err) => {
        assert.strictEqual(err.name, 'TypeError');
        return true;
      });
    });
  });
  describe('#div()', () => {
    it('should calculate valid division', () => {
      assert.deepStrictEqual(new NT(3).div(new NT(4)), new NT(3 / 4));
    });
    it('should calculate invalid division', () => {
      assert.throws(() => {
        new NT(5).div(new ST('123'));
      }, (err) => {
        assert.strictEqual(err.name, 'TypeError');
        return true;
      });
    });
  });
  describe('#rem()', () => {
    it('should calculate valid remainder', () => {
      assert.deepStrictEqual(new NT(3).rem(new NT(4)), new NT(3 % 4));
    });
    it('should calculate invalid remainder', () => {
      assert.throws(() => {
        new NT(5).rem(new ST('123'));
      }, (err) => {
        assert.strictEqual(err.name, 'TypeError');
        return true;
      });
    });
  });
  describe('#exp()', () => {
    it('should calculate valid exponent', () => {
      assert.deepStrictEqual(new NT(3).exp(new NT(4)), new NT(3 ** 4));
    });
    it('should calculate invalid exponent', () => {
      assert.throws(() => {
        new NT(5).exp(new ST('123'));
      }, (err) => {
        assert.strictEqual(err.name, 'TypeError');
        return true;
      });
    });
  });
  describe('#unMinus()', () => {
    it('should calculate unary minus', () => {
      assert.deepStrictEqual(new NT(1234).unMinus(), new NT(-1234));
    });
  });
  describe('#equal()', () => {
    it('should calculate valid equal', () => {
      assert.deepStrictEqual(new NT(9999).equal(new NT(0)), false);
      assert.deepStrictEqual(new NT(123).equal(new NT(123)), true);
    });
    it('should calculate invalid equal', () => {
      assert.throws(() => {
        new NT(0).equal(new ST('5'));
      }, (err) => {
        assert.strictEqual(err.name, 'TypeError');
        return true;
      });
    });
  });
  describe('#greaterEqual()', () => {
    it('should calculate valid greater or equal', () => {
      assert.deepStrictEqual(new NT(999).greaterEqual(new NT(1000)), false);
      assert.deepStrictEqual(new NT(123).greaterEqual(new NT(123)), true);
      assert.deepStrictEqual(new NT(123).greaterEqual(new NT(122)), true);
    });
    it('should calculate invalid greater or equal', () => {
      assert.throws(() => {
        new NT(0).greaterEqual(new ST('5'));
      });
    }, (err) => {
      assert.strictEqual(err.name, 'TypeError');
      return true;
    });
  });
  describe('#greater()', () => {
    it('should calculate valid greater', () => {
      assert.deepStrictEqual(new NT(9999).greater(new NT(0)), true);
      assert.deepStrictEqual(new NT(123).greater(new NT(123)), false);
    });
    it('should calculate invalid greater', () => {
      assert.throws(() => {
        new NT(0).greater(new ST('5'));
      }, (err) => {
        assert.strictEqual(err.name, 'TypeError');
        return true;
      });
    });
  });
  describe('#lessEqual()', () => {
    it('should calculate valid less or equal', () => {
      assert.deepStrictEqual(new NT(9999).lessEqual(new NT(0)), false);
      assert.deepStrictEqual(new NT(123).lessEqual(new NT(123)), true);
      assert.deepStrictEqual(new NT(123).lessEqual(new NT(124)), true);
    });
    it('should calculate invalid less or equal', () => {
      assert.throws(() => {
        new NT(0).lessEqual(new ST('5'));
      }, (err) => {
        assert.strictEqual(err.name, 'TypeError');
        return true;
      });
    });
  });
  describe('#less()', () => {
    it('should calculate valid less', () => {
      assert.deepStrictEqual(new NT(999).less(new NT(1000)), true);
      assert.deepStrictEqual(new NT(123).less(new NT(123)), false);
    });
    it('should calculate invalid less', () => {
      assert.throws(() => {
        new NT(0).less(new ST('5'));
      }, (err) => {
        assert.strictEqual(err.name, 'TypeError');
        return true;
      });
    });
  });
  describe('#notEqual()', () => {
    it('should calculate valid not equal', () => {
      assert.deepStrictEqual(new NT(9999).notEqual(new NT(0)), true);
      assert.deepStrictEqual(new NT(123).notEqual(new NT(123)), false);
    });
    it('should calculate invalid not equal', () => {
      assert.throws(() => {
        new NT(0).notEqual(new ST('5'));
      }, (err) => {
        assert.strictEqual(err.name, 'TypeError');
        return true;
      });
    });
  });
});
