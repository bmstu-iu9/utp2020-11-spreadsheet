import * as assert from 'assert';
import Parser from '../../../lib/parser/Parser.js';

describe('Parser', () => {
  describe('#run()', () => {
    it('should parse valid values', () => {
      assert.strictEqual(new Parser('123').run(), '123');
      assert.strictEqual(new Parser('abd123efg').run(), 'abd123efg');
      assert.strictEqual(new Parser('=1+2+3').run(), 1 + 2 + 3);
      assert.deepEqual(new Parser('=A1').run(), [0, 1]);
    });
    it('should parse invalid values', () => {
      assert.throws(() => { new Parser('=A2B').run(); });
      assert.throws(() => { new Parser('=').run(); });
      assert.throws(() => { new Parser('=1+((5*8)').run(); });
    });
  });
  describe('#parseBlock()', () => {
    it('should parse not function', () => {
      assert.strictEqual(new Parser('123').run(), '123');
      assert.strictEqual(new Parser('abd123efg').run(), 'abd123efg');
    });
    it('should parse function', () => {
      assert.strictEqual(new Parser('=1+2+3').run(), 1 + 2 + 3);
      assert.strictEqual(new Parser('=(1+5^(1/2))/2').run(), (1 + Math.sqrt(5)) / 2);
      assert.strictEqual(new Parser('=5*(2+2)').run(), 5 * (2 + 2));
      assert.deepEqual(new Parser('=A1').run(), [0, 1]);
    });
  });
  describe('#parseEquals()', () => {
    it('should parse valid logic functions (1)', () => {
      assert.strictEqual(new Parser('=5==2+2').run(), false);
      assert.strictEqual(new Parser('=5>=2+2').run(), true);
      assert.strictEqual(new Parser('=5>2+2').run(), true);
      assert.strictEqual(new Parser('=5<=2+2').run(), false);
      assert.strictEqual(new Parser('=5<2+2').run(), false);
      assert.strictEqual(new Parser('=5!=2+2').run(), true);
    });
    it('should parse valid logic functions (2)', () => {
      assert.strictEqual(new Parser('=3==2+2').run(), false);
      assert.strictEqual(new Parser('=3>=2+2').run(), false);
      assert.strictEqual(new Parser('=3>2+2').run(), false);
      assert.strictEqual(new Parser('=3<=2+2').run(), true);
      assert.strictEqual(new Parser('=3<2+2').run(), true);
      assert.strictEqual(new Parser('=3!=2+2').run(), true);
    });
    it('should parse valid logic functions (3)', () => {
      assert.strictEqual(new Parser('=4==2+2').run(), true);
      assert.strictEqual(new Parser('=4>=2+2').run(), true);
      assert.strictEqual(new Parser('=4>2+2').run(), false);
      assert.strictEqual(new Parser('=4<=2+2').run(), true);
      assert.strictEqual(new Parser('=4<2+2').run(), false);
      assert.strictEqual(new Parser('=4!=2+2').run(), false);
    });
    it('should parse invalid logic functions', () => {
      assert.throws(() => { new Parser('=2<3<4').run(); });
      assert.throws(() => { new Parser('=2<').run(); });
      assert.throws(() => { new Parser('=<3').run(); });
      assert.throws(() => { new Parser('=2!3').run(); });
      assert.throws(() => { new Parser('=2=3').run(); });
    });
  });
  describe('#parseExpr()', () => {
    it('should parse valid summarizing functions', () => {
      assert.strictEqual(new Parser('=2+2').run(), 4);
      assert.strictEqual(new Parser('=13+27').run(), 40);
      assert.strictEqual(new Parser('=436542641+23152654').run(), 436542641 + 23152654);
    });
    it('should parse valid subtractive functions', () => {
      assert.strictEqual(new Parser('=2-2').run(), 0);
      assert.strictEqual(new Parser('=13-27').run(), -14);
      assert.strictEqual(new Parser('=436542641-23152654').run(), 436542641 - 23152654);
    });
  });
  describe('#parseTerm()', () => {
    it('should parse valid multiplying functions', () => {
      assert.strictEqual(new Parser('=2*2').run(), 4);
      assert.strictEqual(new Parser('=13*27').run(), 13 * 27);
      assert.strictEqual(new Parser('=436542*23152').run(), 436542 * 23152);
    });
    it('should parse valid dividing functions', () => {
      assert.strictEqual(new Parser('=2/2').run(), 2 / 2);
      assert.strictEqual(new Parser('=13/27').run(), 13 / 27);
      assert.strictEqual(new Parser('=436542641/23152654').run(), 436542641 / 23152654);
    });
    it('should parse valid residual  functions', () => {
      assert.strictEqual(new Parser('=2%2').run(), 2 % 2);
      assert.strictEqual(new Parser('=13%27').run(), 13 % 27);
      assert.strictEqual(new Parser('=436542641%23152654').run(), 436542641 % 23152654);
    });
  });
  describe('#parseFactor()', () => {
    it('should parse valid power functions', () => {
      assert.strictEqual(new Parser('=2^2').run(), 4);
      assert.strictEqual(new Parser('=1^1000').run(), 1);
      assert.strictEqual(new Parser('=0^1000').run(), 0);
      assert.strictEqual(new Parser('=2^10').run(), 1024);
    });
  });
  describe('#parsePower() && #parseArgs()', () => {
    it('should parse valid bracket sequence', () => {
      assert.strictEqual(new Parser('=(((1+1)+1)+1)+1').run(), 5);
      assert.strictEqual(new Parser('=((((2))+(((2)))))').run(), 4);
    });
    it('should parse invalid bracket sequence', () => {
      assert.throws(() => { new Parser('=((1+1)+1)+1)+1').run(); });
      assert.throws(() => { new Parser('=((((2))+(((2))))').run(); });
    });
    it('should parse valid functions with unary minus', () => {
      assert.strictEqual(new Parser('=-1').run(), -1);
      assert.strictEqual(new Parser('=(-2)^3').run(), -8);
      assert.strictEqual(new Parser('=5*(-5)').run(), -25);
    });
    it('should parse validity function name', () => {
      assert.deepEqual(new Parser('=СУММА(1;2)').run(), ['СУММА', [1, 2]]);
      assert.deepEqual(new Parser('=КОРЕНЬ(5)').run(), ['КОРЕНЬ', [5]]);
      assert.deepEqual(new Parser('=ЛЮБЛЮПИСАТЬТЕСТЫ()').run(), ['ЛЮБЛЮПИСАТЬТЕСТЫ', []]);
      assert.deepEqual(new Parser('=ИУТОП()').run(), ['ИУТОП', []]);
    });
    it('should parse invalidity function name', () => {
      assert.throws(() => { new Parser('=СУММА').run(); });
      assert.throws(() => { new Parser('=КОРЕНЬ(5').run(); });
      assert.throws(() => { new Parser('=КОРЕНЬ(5;0').run(); });
      assert.throws(() => { new Parser('=ЛЮБЛЮПИСАТЬТЕСТЫ').run(); });
      assert.throws(() => { new Parser('=ИУТОП').run(); });
    });
  });
  describe('#parseStr()', () => {
    it('should parse valid strings', () => {
      assert.strictEqual(new Parser('="2^2"').run(), '2^2');
      assert.strictEqual(new Parser('="a"+"b"').run(), 'ab');
      assert.strictEqual(new Parser('="A"+1+":B"+2').run(), 'A1:B2');
    });
    it('should parse invalid strings', () => {
      assert.throws(() => { new Parser('="a').run(); });
      assert.throws(() => { new Parser('="a""b"').run(); });
      assert.throws(() => { new Parser('=b"').run(); });
    });
    it('should parse impossible strings', () => {
      assert.throws(() => { new Parser('a').parseStr(); });
    });
  });
  describe('#parseValue()', () => {
    it('should parse invalid something', () => {
      assert.throws(() => { new Parser('=*').run(); });
      assert.throws(() => { new Parser('=~').run(); });
      assert.throws(() => { new Parser('=^').run(); });
    });
    it('should parse valid interval', () => {
      assert.deepEqual(new Parser('=A2:B8').run(), [[0, 2], [1, 8]]);
    });
    it('should parse invalid interval', () => {
      assert.throws(() => { new Parser('=A2:B').run(); });
      assert.throws(() => { new Parser('=A2:').run(); });
    });
  });
});
