import * as assert from 'assert';
import Parser from '../../../lib/parser/Parser.js';
import EW from '../../../lib/parser/ExpressionWrapper.js';

describe('Parser', () => {
  describe('#run()', () => {
    it('should parse valid values', () => {
      assert.deepEqual(new Parser('123').run(), EW.makeClearValue('123'));
      assert.deepEqual(new Parser('abd123efg').run(), EW.makeClearValue('abd123efg'));
      assert.deepEqual(new Parser('=1+2+3').run(), EW.sum(EW.sum(1, 2), 3));
      assert.deepEqual(new Parser('=A1').run(), EW.makeAddress(0, 0));
    });
    it('should parse invalid values', () => {
      assert.throws(() => {
        new Parser('=A2B').run();
      });
      assert.throws(() => {
        new Parser('=').run();
      });
      assert.throws(() => {
        new Parser('=1+((5*8)').run();
      });
    });
  });
  describe('#parseBlock()', () => {
    it('should parse not function', () => {
      assert.deepEqual(new Parser('123').run(), EW.makeClearValue('123'));
      assert.deepEqual(new Parser('abd123efg').run(), EW.makeClearValue('abd123efg'));
    });
    it('should parse function', () => {
      assert.deepEqual(new Parser('=1+2+3').run(), EW.sum(EW.sum(1, 2), 3));
      assert.deepEqual(new Parser('=(1+5^(1/2))/2').run(), EW.del(EW.sum(1, EW.exp(5, EW.del(1, 2))), 2));
      assert.deepEqual(new Parser('=5*(2+2)').run(), EW.mul(5, EW.sum(2, 2)));
      assert.deepEqual(new Parser('=A1').run(), EW.makeAddress(0, 0));
    });
  });
  describe('#parseEquals()', () => {
    it('should parse valid logic functions (1)', () => {
      assert.deepEqual(new Parser('=5==2+2').run(), EW.equal(5, EW.sum(2, 2)));
      assert.deepEqual(new Parser('=5>=2+2').run(), EW.greaterEqual(5, EW.sum(2, 2)));
      assert.deepEqual(new Parser('=5>2+2').run(), EW.greater(5, EW.sum(2, 2)));
      assert.deepEqual(new Parser('=5<=2+2').run(), EW.lessEqual(5, EW.sum(2, 2)));
      assert.deepEqual(new Parser('=5<2+2').run(), EW.less(5, EW.sum(2, 2)));
      assert.deepEqual(new Parser('=5!=2+2').run(), EW.notEqual(5, EW.sum(2, 2)));
    });
    it('should parse valid logic functions (2)', () => {
      assert.deepEqual(new Parser('=3==2+2').run(), EW.equal(3, EW.sum(2, 2)));
      assert.deepEqual(new Parser('=3>=2+2').run(), EW.greaterEqual(3, EW.sum(2, 2)));
      assert.deepEqual(new Parser('=3>2+2').run(), EW.greater(3, EW.sum(2, 2)));
      assert.deepEqual(new Parser('=3<=2+2').run(), EW.lessEqual(3, EW.sum(2, 2)));
      assert.deepEqual(new Parser('=3<2+2').run(), EW.less(3, EW.sum(2, 2)));
      assert.deepEqual(new Parser('=3!=2+2').run(), EW.notEqual(3, EW.sum(2, 2)));
    });
    it('should parse valid logic functions (3)', () => {
      assert.deepEqual(new Parser('=4==2+2').run(), EW.equal(4, EW.sum(2, 2)));
      assert.deepEqual(new Parser('=4>=2+2').run(), EW.greaterEqual(4, EW.sum(2, 2)));
      assert.deepEqual(new Parser('=4>2+2').run(), EW.greater(4, EW.sum(2, 2)));
      assert.deepEqual(new Parser('=4<=2+2').run(), EW.lessEqual(4, EW.sum(2, 2)));
      assert.deepEqual(new Parser('=4<2+2').run(), EW.less(4, EW.sum(2, 2)));
      assert.deepEqual(new Parser('=4!=2+2').run(), EW.notEqual(4, EW.sum(2, 2)));
    });
    it('should parse invalid logic functions', () => {
      assert.throws(() => {
        new Parser('=2<3<4').run();
      });
      assert.throws(() => {
        new Parser('=2<').run();
      });
      assert.throws(() => {
        new Parser('=<3').run();
      });
      assert.throws(() => {
        new Parser('=2!3').run();
      });
      assert.throws(() => {
        new Parser('=2=3').run();
      });
    });
  });
  describe('#parseExpr()', () => {
    it('should parse valid summarizing functions', () => {
      assert.deepEqual(new Parser('=2+2').run(), EW.sum(2, 2));
      assert.deepEqual(new Parser('=13+27').run(), EW.sum(13, 27));
      assert.deepEqual(new Parser('=436542641+23152654').run(), EW.sum(436542641, 23152654));
    });
    it('should parse valid subtractive functions', () => {
      assert.deepEqual(new Parser('=2-2').run(), EW.sub(2, 2));
      assert.deepEqual(new Parser('=13-27').run(), EW.sub(13, 27));
      assert.deepEqual(new Parser('=436542641-23152654').run(), EW.sub(436542641, 23152654));
    });
  });
  describe('#parseTerm()', () => {
    it('should parse valid multiplying functions', () => {
      assert.deepEqual(new Parser('=2*2').run(), EW.mul(2, 2));
      assert.deepEqual(new Parser('=13*27').run(), EW.mul(13, 27));
      assert.deepEqual(new Parser('=436542641*23152654').run(), EW.mul(436542641, 23152654));
    });
    it('should parse valid dividing functions', () => {
      assert.deepEqual(new Parser('=2/2').run(), EW.del(2, 2));
      assert.deepEqual(new Parser('=13/27').run(), EW.del(13, 27));
      assert.deepEqual(new Parser('=436542641/23152654').run(), EW.del(436542641, 23152654));
    });
    it('should parse valid residual  functions', () => {
      assert.deepEqual(new Parser('=2%2').run(), EW.rem(2, 2));
      assert.deepEqual(new Parser('=13%27').run(), EW.rem(13, 27));
      assert.deepEqual(new Parser('=436542641%23152654').run(), EW.rem(436542641, 23152654));
    });
  });
  describe('#parseFactor()', () => {
    it('should parse valid power functions', () => {
      assert.deepEqual(new Parser('=2^2').run(), EW.exp(2, 2));
      assert.deepEqual(new Parser('=1^1000').run(), EW.exp(1, 1000));
      assert.deepEqual(new Parser('=0^1000').run(), EW.exp(0, 1000));
      assert.deepEqual(new Parser('=2^10').run(), EW.exp(2, 10));
    });
  });
  describe('#parsePower() && #parseArgs()', () => {
    it('should parse valid bracket sequence', () => {
      assert.deepEqual(new Parser('=(((1+1)+1)+1)+1').run(), EW.sum(EW.sum(EW.sum(EW.sum(1, 1), 1), 1), 1));
      assert.deepEqual(new Parser('=((((2))+(((2)))))').run(), EW.sum(2, 2));
    });
    it('should parse invalid bracket sequence', () => {
      assert.throws(() => {
        new Parser('=((1+1)+1)+1)+1').run();
      });
      assert.throws(() => {
        new Parser('=((((2))+(((2))))').run();
      });
    });
    it('should parse valid functions with unary minus', () => {
      assert.deepEqual(new Parser('=-1').run(), EW.unMinus(1));
      assert.deepEqual(new Parser('=(-2)^3').run(), EW.exp(EW.unMinus(2), 3));
      assert.deepEqual(new Parser('=5*(-5)').run(), EW.mul(5, EW.unMinus(5)));
    });
    it('should parse validity function name', () => {
      assert.deepEqual(new Parser('=СУММА(1;2)').run(), EW.makeFuncWithArgs('СУММА', 1, 2));
      assert.deepEqual(new Parser('=КОРЕНЬ(5)').run(), EW.makeFuncWithArgs('КОРЕНЬ', 5));
      assert.deepEqual(new Parser('=ЛЮБЛЮПИСАТЬТЕСТЫ()').run(), EW.makeFunc('ЛЮБЛЮПИСАТЬТЕСТЫ'));
      assert.deepEqual(new Parser('=ИУТОП()').run(), EW.makeFunc('ИУТОП'));
    });
    it('should parse invalidity function name', () => {
      assert.throws(() => {
        new Parser('=СУММА').run();
      });
      assert.throws(() => {
        new Parser('=КОРЕНЬ(5').run();
      });
      assert.throws(() => {
        new Parser('=КОРЕНЬ(5;0').run();
      });
      assert.throws(() => {
        new Parser('=ЛЮБЛЮПИСАТЬТЕСТЫ').run();
      });
      assert.throws(() => {
        new Parser('=ИУТОП').run();
      });
    });
  });
  describe('#parseStr()', () => {
    it('should parse valid strings', () => {
      assert.deepEqual(new Parser('="2^2"').run(), '2^2');
      assert.deepEqual(new Parser('="a"+"b"').run(), EW.sum('a', 'b'));
      assert.deepEqual(new Parser('="A"+1+":B"+2').run(), EW.sum(EW.sum(EW.sum('A', 1), ':B'), 2));
    });
    it('should parse invalid strings', () => {
      assert.throws(() => {
        new Parser('="a').run();
      });
      assert.throws(() => {
        new Parser('="a""b"').run();
      });
      assert.throws(() => {
        new Parser('=b"').run();
      });
    });
    it('should parse impossible strings', () => {
      assert.throws(() => {
        new Parser('a').parseStr();
      });
    });
  });
  describe('#parseValue()', () => {
    it('should parse invalid something', () => {
      assert.throws(() => {
        new Parser('=*').run();
      });
      assert.throws(() => {
        new Parser('=~').run();
      });
      assert.throws(() => {
        new Parser('=^').run();
      });
    });
    it('should parse valid interval', () => {
      assert.deepEqual(new Parser('=A2:B8').run(), EW.makeInterval(EW.makeAddress(0, 1), EW.makeAddress(1, 7)));
    });
    it('should parse invalid interval', () => {
      assert.throws(() => {
        new Parser('=A2:B').run();
      });
      assert.throws(() => {
        new Parser('=A2:').run();
      });
    });
  });
});
