import * as assert from 'assert';
import IT from '../../../lib/typevalue/IntervalType.js';
import Parser from '../../../lib/parser/Parser.js';

describe('IntervalType', () => {
  describe('#constructor()', () => {
    it('should make new element', () => {
      const interval = new Parser('A1:B2').parseValue();
      assert.deepStrictEqual(new IT(interval).address1, interval[1]);
      assert.deepStrictEqual(new IT(interval).address2, interval[2]);
    });
  });
  describe('#makeTypeError()', () => {
    it('should make error', () => {
      assert.throws(() => {
        IT.makeTypeError('makeTypeError');
      }, TypeError);
    });
  });
  describe('#getArrayAddresses()', () => {
    it('should get array addresses (1)', () => {
      const controlValue = ['A1', 'B1', 'A2', 'B2', 'A3', 'B3', 'A4', 'B4']
        .map((elem) => new Parser(elem).parseAddress());
      const interval1 = new IT(new Parser('A1:B4').parseValue()).getArrayAddresses();
      const interval2 = new IT(new Parser('A4:B1').parseValue()).getArrayAddresses();
      const interval3 = new IT(new Parser('B1:A4').parseValue()).getArrayAddresses();
      const interval4 = new IT(new Parser('B4:A1').parseValue()).getArrayAddresses();
      assert.deepStrictEqual(controlValue, interval1);
      assert.deepStrictEqual(controlValue, interval2);
      assert.deepStrictEqual(controlValue, interval3);
      assert.deepStrictEqual(controlValue, interval4);
    });
    it('should get array addresses (1)', () => {
      const controlValue = ['Y10', 'Z10', 'AA10', 'AB10']
        .map((elem) => new Parser(elem).parseAddress());
      const interval = new IT(new Parser('Y10:AB10').parseValue()).getArrayAddresses();
      assert.deepStrictEqual(controlValue, interval);
    });
  });
});
