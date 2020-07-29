import * as assert from 'assert';
import ST from '../../../lib/typevalue/StringType.js';
import NT from '../../../lib/typevalue/NumberType.js';

describe('NumberType', () => {
  describe('#constructor()', () => {
    it('should make new element', () => {
      assert.deepStrictEqual(new NT(123).value, 123);
      assert.deepStrictEqual(new NT(231).value, 231);
      assert.deepStrictEqual(new NT(312).value, 312);
    });
  });
  describe('#sum()', () => {
    it('should calculate valid sum', () => {
      assert.deepStrictEqual(new NT(1234).sum(new NT(3245)), new NT(1234 + 3245));
      assert.deepStrictEqual(new NT(234).sum(new NT(2134)), new NT(234 + 2134));
      assert.deepStrictEqual(new NT(3).sum(new NT(4)), new NT(3 + 4));
    });
    it('should calculate invalid sum', () => {
      assert.throws(() => {
        new NT(5).sum(new ST('123'));
      });
      assert.throws(() => {
        new NT(0).sum(new ST('5'));
      });
      assert.throws(() => {
        new NT(-7).sum(new ST('hi'));
      });
    });
  });
  describe('#sub()', () => {
    it('should calculate valid subtraction', () => {
      assert.deepStrictEqual(new NT(1234).sub(new NT(3245)), new NT(1234 - 3245));
      assert.deepStrictEqual(new NT(234).sub(new NT(2134)), new NT(234 - 2134));
      assert.deepStrictEqual(new NT(3).sub(new NT(4)), new NT(3 - 4));
    });
    it('should calculate invalid subtraction', () => {
      assert.throws(() => {
        new NT(5).sub(new ST('123'));
      });
      assert.throws(() => {
        new NT(0).sub(new ST('5'));
      });
      assert.throws(() => {
        new NT(-7).sub(new ST('hi'));
      });
    });
  });
  describe('#mul()', () => {
    it('should calculate valid multiplication', () => {
      assert.deepStrictEqual(new NT(1234).mul(new NT(3245)), new NT(1234 * 3245));
      assert.deepStrictEqual(new NT(234).mul(new NT(2134)), new NT(234 * 2134));
      assert.deepStrictEqual(new NT(3).mul(new NT(4)), new NT(3 * 4));
    });
    it('should calculate invalid multiplication', () => {
      assert.throws(() => {
        new NT(5).mul(new ST('123'));
      });
      assert.throws(() => {
        new NT(0).mul(new ST('5'));
      });
      assert.throws(() => {
        new NT(-7).mul(new ST('hi'));
      });
    });
  });
  describe('#div()', () => {
    it('should calculate valid division', () => {
      assert.deepStrictEqual(new NT(1234).div(new NT(3245)), new NT(1234 / 3245));
      assert.deepStrictEqual(new NT(234).div(new NT(2134)), new NT(234 / 2134));
      assert.deepStrictEqual(new NT(3).div(new NT(4)), new NT(3 / 4));
    });
    it('should calculate invalid division', () => {
      assert.throws(() => {
        new NT(5).div(new ST('123'));
      });
      assert.throws(() => {
        new NT(0.001).div(new ST('2'));
      });
      assert.throws(() => {
        new NT(-7).div(new ST('hi'));
      });
    });
  });
  describe('#rem()', () => {
    it('should calculate valid remainder', () => {
      assert.deepStrictEqual(new NT(3245).rem(new NT(1234)), new NT(3245 % 1234));
      assert.deepStrictEqual(new NT(2134).rem(new NT(234)), new NT(2134 % 234));
      assert.deepStrictEqual(new NT(3).rem(new NT(4)), new NT(3 % 4));
    });
    it('should calculate invalid remainder', () => {
      assert.throws(() => {
        new NT(5).rem(new ST('123'));
      });
      assert.throws(() => {
        new NT(0.001).rem(new ST('2'));
      });
      assert.throws(() => {
        new NT(10).rem(new NT(2.5));
      });
    });
  });
  describe('#exp()', () => {
    it('should calculate valid exponent', () => {
      assert.deepStrictEqual(new NT(1234).exp(new NT(3245)), new NT(1234 ** 3245));
      assert.deepStrictEqual(new NT(234).exp(new NT(2134)), new NT(234 ** 2134));
      assert.deepStrictEqual(new NT(3).exp(new NT(4)), new NT(3 ** 4));
    });
    it('should calculate invalid exponent', () => {
      assert.throws(() => {
        new NT(5).exp(new ST('123'));
      });
      assert.throws(() => {
        new NT(0).exp(new ST('5'));
      });
      assert.throws(() => {
        new NT(-7).exp(new ST('hi'));
      });
    });
  });
  describe('#unMinus()', () => {
    it('should calculate unary minus', () => {
      assert.deepStrictEqual(new NT(1234).unMinus(), new NT(-1234));
      assert.deepStrictEqual(new NT(234).unMinus(), new NT(-234));
      assert.deepStrictEqual(new NT(3).unMinus(), new NT(-3));
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
      });
    });
  });
  describe('#greaterEqual()', () => {
    it('should calculate valid greater or equal', () => {
      assert.deepStrictEqual(new NT(9999).greaterEqual(new NT(0)), true);
      assert.deepStrictEqual(new NT(123).greaterEqual(new NT(123)), true);
    });
    it('should calculate invalid greater or equal', () => {
      assert.throws(() => {
        new NT(0).greaterEqual(new ST('5'));
      });
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
      });
    });
  });
  describe('#lessEqual()', () => {
    it('should calculate valid less or equal', () => {
      assert.deepStrictEqual(new NT(9999).lessEqual(new NT(0)), false);
      assert.deepStrictEqual(new NT(123).lessEqual(new NT(123)), true);
    });
    it('should calculate invalid less or equal', () => {
      assert.throws(() => {
        new NT(0).lessEqual(new ST('5'));
      });
    });
  });
  describe('#less()', () => {
    it('should calculate valid less', () => {
      assert.deepStrictEqual(new NT(9999).less(new NT(0)), false);
      assert.deepStrictEqual(new NT(123).less(new NT(123)), false);
    });
    it('should calculate invalid less', () => {
      assert.throws(() => {
        new NT(0).less(new ST('5'));
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
      });
    });
  });
});
