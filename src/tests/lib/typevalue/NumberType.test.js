import * as assert from 'assert';
import ST from '../../../lib/typevalue/StringType.js';
import NT from '../../../lib/typevalue/NumberType.js';

describe('NumberType', () => {
  describe('#constructor()', () => {
    it('should make new element', () => {
      assert.deepEqual(new NT(123).value, 123);
      assert.deepEqual(new NT(231).value, 231);
      assert.deepEqual(new NT(312).value, 312);
    });
  });
  describe('#sum()', () => {
    it('should calculate valid sum', () => {
      assert.deepEqual(new NT(1234).sum(new NT(3245)), new NT(1234 + 3245));
      assert.deepEqual(new NT(234).sum(new NT(2134)), new NT(234 + 2134));
      assert.deepEqual(new NT(3).sum(new NT(4)), new NT(3 + 4));
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
      assert.deepEqual(new NT(1234).sub(new NT(3245)), new NT(1234 - 3245));
      assert.deepEqual(new NT(234).sub(new NT(2134)), new NT(234 - 2134));
      assert.deepEqual(new NT(3).sub(new NT(4)), new NT(3 - 4));
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
      assert.deepEqual(new NT(1234).mul(new NT(3245)), new NT(1234 * 3245));
      assert.deepEqual(new NT(234).mul(new NT(2134)), new NT(234 * 2134));
      assert.deepEqual(new NT(3).mul(new NT(4)), new NT(3 * 4));
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
      assert.deepEqual(new NT(1234).div(new NT(3245)), new NT(1234 / 3245));
      assert.deepEqual(new NT(234).div(new NT(2134)), new NT(234 / 2134));
      assert.deepEqual(new NT(3).div(new NT(4)), new NT(3 / 4));
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
      assert.deepEqual(new NT(3245).rem(new NT(1234)), new NT(3245 % 1234));
      assert.deepEqual(new NT(2134).rem(new NT(234)), new NT(2134 % 234));
      assert.deepEqual(new NT(3).rem(new NT(4)), new NT(3 % 4));
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
      assert.deepEqual(new NT(1234).exp(new NT(3245)), new NT(1234 ** 3245));
      assert.deepEqual(new NT(234).exp(new NT(2134)), new NT(234 ** 2134));
      assert.deepEqual(new NT(3).exp(new NT(4)), new NT(3 ** 4));
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
      assert.deepEqual(new NT(1234).unMinus(), new NT(-1234));
      assert.deepEqual(new NT(234).unMinus(), new NT(-234));
      assert.deepEqual(new NT(3).unMinus(), new NT(-3));
    });
  });
});
