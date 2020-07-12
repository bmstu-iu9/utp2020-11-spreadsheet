import * as assert from 'assert';
import Parser from '../../../lib/parser/Parser.js';
import EW from '../../../lib/parser/ExpressionWrapper.js';

describe('Parser', () => {
  describe('#run()', () => {
    it('should parse valid values', () => {
      assert.deepEqual(new Parser('123').run(), EW.makeClearValue('123'));
      assert.deepEqual(new Parser('abd123efg').run(), EW.makeClearValue('abd123efg'));
      assert.deepEqual(new Parser('=1+2+3').run(), EW.sum(EW.sum(EW.makeNumber(1), EW.makeNumber(2)), EW.makeNumber(3)));
      assert.deepEqual(new Parser('=A1').run(), EW.makeAddress('A', 1));
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
      assert.deepEqual(new Parser('=1+2+3').run(), EW.sum(EW.sum(EW.makeNumber(1), EW.makeNumber(2)), EW.makeNumber(3)));
      assert.deepEqual(new Parser('=(1+5^(1/2))/2').run(),
        EW.div(EW.sum(EW.makeNumber(1), EW.exp(EW.makeNumber(5), EW.div(EW.makeNumber(1), EW.makeNumber(2)))), EW.makeNumber(2)));
      assert.deepEqual(new Parser('=5*(2+2)').run(), EW.mul(EW.makeNumber(5), EW.sum(EW.makeNumber(2), EW.makeNumber(2))));
      assert.deepEqual(new Parser('=A1').run(), EW.makeAddress('A', 1));
    });
  });
  describe('#parseEquals()', () => {
    it('should parse valid logic functions (1)', () => {
      assert.deepEqual(new Parser('=5==2+2').run(), EW.equal(EW.makeNumber(5), EW.sum(EW.makeNumber(2), EW.makeNumber(2))));
      assert.deepEqual(new Parser('=5>=2+2').run(), EW.greaterEqual(EW.makeNumber(5), EW.sum(EW.makeNumber(2), EW.makeNumber(2))));
      assert.deepEqual(new Parser('=5>2+2').run(), EW.greater(EW.makeNumber(5), EW.sum(EW.makeNumber(2), EW.makeNumber(2))));
      assert.deepEqual(new Parser('=5<=2+2').run(), EW.lessEqual(EW.makeNumber(5), EW.sum(EW.makeNumber(2), EW.makeNumber(2))));
      assert.deepEqual(new Parser('=5<2+2').run(), EW.less(EW.makeNumber(5), EW.sum(EW.makeNumber(2), EW.makeNumber(2))));
      assert.deepEqual(new Parser('=5!=2+2').run(), EW.notEqual(EW.makeNumber(5), EW.sum(EW.makeNumber(2), EW.makeNumber(2))));
    });
    it('should parse valid logic functions (2)', () => {
      assert.deepEqual(new Parser('=3==2+2').run(), EW.equal(EW.makeNumber(3), EW.sum(EW.makeNumber(2), EW.makeNumber(2))));
      assert.deepEqual(new Parser('=3>=2+2').run(), EW.greaterEqual(EW.makeNumber(3), EW.sum(EW.makeNumber(2), EW.makeNumber(2))));
      assert.deepEqual(new Parser('=3>2+2').run(), EW.greater(EW.makeNumber(3), EW.sum(EW.makeNumber(2), EW.makeNumber(2))));
      assert.deepEqual(new Parser('=3<=2+2').run(), EW.lessEqual(EW.makeNumber(3), EW.sum(EW.makeNumber(2), EW.makeNumber(2))));
      assert.deepEqual(new Parser('=3<2+2').run(), EW.less(EW.makeNumber(3), EW.sum(EW.makeNumber(2), EW.makeNumber(2))));
      assert.deepEqual(new Parser('=3!=2+2').run(), EW.notEqual(EW.makeNumber(3), EW.sum(EW.makeNumber(2), EW.makeNumber(2))));
    });
    it('should parse valid logic functions (3)', () => {
      assert.deepEqual(new Parser('=4==2+2').run(), EW.equal(EW.makeNumber(4), EW.sum(EW.makeNumber(2), EW.makeNumber(2))));
      assert.deepEqual(new Parser('=4>=2+2').run(), EW.greaterEqual(EW.makeNumber(4), EW.sum(EW.makeNumber(2), EW.makeNumber(2))));
      assert.deepEqual(new Parser('=4>2+2').run(), EW.greater(EW.makeNumber(4), EW.sum(EW.makeNumber(2), EW.makeNumber(2))));
      assert.deepEqual(new Parser('=4<=2+2').run(), EW.lessEqual(EW.makeNumber(4), EW.sum(EW.makeNumber(2), EW.makeNumber(2))));
      assert.deepEqual(new Parser('=4<2+2').run(), EW.less(EW.makeNumber(4), EW.sum(EW.makeNumber(2), EW.makeNumber(2))));
      assert.deepEqual(new Parser('=4!=2+2').run(), EW.notEqual(EW.makeNumber(4), EW.sum(EW.makeNumber(2), EW.makeNumber(2))));
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
      assert.deepEqual(new Parser('=2+2').run(), EW.sum(EW.makeNumber(2), EW.makeNumber(2)));
      assert.deepEqual(new Parser('=13+27').run(), EW.sum(EW.makeNumber(13), EW.makeNumber(27)));
      assert.deepEqual(new Parser('=436542641+23152654').run(), EW.sum(EW.makeNumber(436542641), EW.makeNumber(23152654)));
    });
    it('should parse valid subtractive functions', () => {
      assert.deepEqual(new Parser('=2-2').run(), EW.sub(EW.makeNumber(2), EW.makeNumber(2)));
      assert.deepEqual(new Parser('=13-27').run(), EW.sub(EW.makeNumber(13), EW.makeNumber(27)));
      assert.deepEqual(new Parser('=436542641-23152654').run(), EW.sub(EW.makeNumber(436542641), EW.makeNumber(23152654)));
    });
  });
  describe('#parseTerm()', () => {
    it('should parse valid multiplying functions', () => {
      assert.deepEqual(new Parser('=2*2').run(), EW.mul(EW.makeNumber(2), EW.makeNumber(2)));
      assert.deepEqual(new Parser('=13*27').run(), EW.mul(EW.makeNumber(13), EW.makeNumber(27)));
      assert.deepEqual(new Parser('=436542641*23152654').run(), EW.mul(EW.makeNumber(436542641), EW.makeNumber(23152654)));
    });
    it('should parse valid dividing functions', () => {
      assert.deepEqual(new Parser('=2/2').run(), EW.div(EW.makeNumber(2), EW.makeNumber(2)));
      assert.deepEqual(new Parser('=13/27').run(), EW.div(EW.makeNumber(13), EW.makeNumber(27)));
      assert.deepEqual(new Parser('=436542641/23152654').run(), EW.div(EW.makeNumber(436542641), EW.makeNumber(23152654)));
    });
    it('should parse valid residual  functions', () => {
      assert.deepEqual(new Parser('=2%2').run(), EW.rem(EW.makeNumber(2), EW.makeNumber(2)));
      assert.deepEqual(new Parser('=13%27').run(), EW.rem(EW.makeNumber(13), EW.makeNumber(27)));
      assert.deepEqual(new Parser('=436542641%23152654').run(), EW.rem(EW.makeNumber(436542641), EW.makeNumber(23152654)));
    });
  });
  describe('#parseFactor()', () => {
    it('should parse valid power functions', () => {
      assert.deepEqual(new Parser('=2^2').run(), EW.exp(EW.makeNumber(2), EW.makeNumber(2)));
      assert.deepEqual(new Parser('=1^1000').run(), EW.exp(EW.makeNumber(1), EW.makeNumber(1000)));
      assert.deepEqual(new Parser('=0^1000').run(), EW.exp(EW.makeNumber(0), EW.makeNumber(1000)));
      assert.deepEqual(new Parser('=2^10').run(), EW.exp(EW.makeNumber(2), EW.makeNumber(10)));
    });
  });
  describe('#parsePower() && #parseArgs()', () => {
    it('should parse valid bracket sequence', () => {
      assert.deepEqual(new Parser('=(((1+1)+1)+1)+1').run(),
        EW.sum(EW.sum(EW.sum(EW.sum(EW.makeNumber(1), EW.makeNumber(1)), EW.makeNumber(1)), EW.makeNumber(1)), EW.makeNumber(1)));
      assert.deepEqual(new Parser('=((((2))+(((2)))))').run(), EW.sum(EW.makeNumber(2), EW.makeNumber(2)));
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
      assert.deepEqual(new Parser('=-1').run(), EW.unMinus(EW.makeNumber(1)));
      assert.deepEqual(new Parser('=(-2)^3').run(), EW.exp(EW.unMinus(EW.makeNumber(2)), EW.makeNumber(3)));
      assert.deepEqual(new Parser('=5*(-5)').run(), EW.mul(EW.makeNumber(5), EW.unMinus(EW.makeNumber(5))));
    });
    it('should parse validity function name', () => {
      assert.deepEqual(new Parser('=СУММА(1;2)').run(), EW.makeFuncWithArgs('СУММА', EW.makeNumber(1), EW.makeNumber(2)));
      assert.deepEqual(new Parser('=КОРЕНЬ(5)').run(), EW.makeFuncWithArgs('КОРЕНЬ', EW.makeNumber(5)));
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
      assert.deepEqual(new Parser('="2^2"').run(), EW.makeString('2^2'));
      assert.deepEqual(new Parser('="a"+"b"').run(), EW.sum(EW.makeString('a'), EW.makeString('b')));
      assert.deepEqual(new Parser('="A"+1+":B"+2').run(),
        EW.sum(EW.sum(EW.sum(EW.makeString('A'), EW.makeNumber(1)), EW.makeString(':B')), EW.makeNumber(2)));
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
      assert.deepEqual(new Parser('=A2:B8').run(), EW.makeInterval(EW.makeAddress('A', 2), EW.makeAddress('B', 8)));
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
