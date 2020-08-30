import * as assert from 'assert';
import Parser from '../../../lib/parser/Parser.js';
import EW from '../../../lib/parser/ExpressionWrapper.js';
import FormatError from '../../../lib/errors/FormatError.js';

describe('Parser', () => {
  describe('#run()', () => {
    it('should parse valid values', () => {
      assert.deepStrictEqual(new Parser('123').run(), EW.makeClearValue('123'));
      assert.deepStrictEqual(new Parser('abd123efg').run(), EW.makeClearValue('abd123efg'));
      assert.deepStrictEqual(new Parser('=1+2+3').run(), EW.sum(EW.sum(EW.makeNumber(1), EW.makeNumber(2)), EW.makeNumber(3)));
      assert.deepStrictEqual(new Parser('=A1').run(), EW.makeAddress('A', 1, 0, 0));
    });
    it('should parse invalid values', () => {
      assert.throws(() => {
        new Parser('=A2B').run();
      }, FormatError);
      assert.throws(() => {
        new Parser('=').run();
      }, FormatError);
      assert.throws(() => {
        new Parser('=1+((5*8)').run();
      }, FormatError);
    });
  });
  describe('#parseBlock()', () => {
    it('should parse not function', () => {
      assert.deepStrictEqual(new Parser('123').run(), EW.makeClearValue('123'));
      assert.deepStrictEqual(new Parser('abd123efg').run(), EW.makeClearValue('abd123efg'));
    });
    it('should parse function', () => {
      assert.deepStrictEqual(new Parser('=1+2+3').run(),
        EW.sum(EW.sum(EW.makeNumber(1), EW.makeNumber(2)), EW.makeNumber(3)));

      assert.deepStrictEqual(new Parser('= ( 1 + 5 ^ ( 1 / 2 ) ) / 2 ').run(),
        EW.div(EW.sum(EW.makeNumber(1), EW.exp(EW.makeNumber(5),
          EW.div(EW.makeNumber(1), EW.makeNumber(2)))), EW.makeNumber(2)));
      assert.deepStrictEqual(new Parser('=A1').run(), EW.makeAddress('A', 1, 0, 0));
    });
  });
  describe('#parseEquals()', () => {
    it('should parse valid logic functions', () => {
      const testCases = [
        {
          inputString: '=5==2+2',
          expression: EW.equal(EW.makeNumber(5), EW.sum(EW.makeNumber(2), EW.makeNumber(2))),
        },
        {
          inputString: '=5>=2+2',
          expression: EW.greaterEqual(EW.makeNumber(5), EW.sum(EW.makeNumber(2), EW.makeNumber(2))),
        },
        {
          inputString: '=5>2+2',
          expression: EW.greater(EW.makeNumber(5), EW.sum(EW.makeNumber(2), EW.makeNumber(2))),
        },
        {
          inputString: '=5<=2+2',
          expression: EW.lessEqual(EW.makeNumber(5), EW.sum(EW.makeNumber(2), EW.makeNumber(2))),
        },
        {
          inputString: '= 5 < 2 + 2 ',
          expression: EW.less(EW.makeNumber(5), EW.sum(EW.makeNumber(2), EW.makeNumber(2))),
        },
        {
          inputString: '= 5 != 2 + 2 ',
          expression: EW.notEqual(EW.makeNumber(5), EW.sum(EW.makeNumber(2), EW.makeNumber(2))),
        },
      ];
      testCases.forEach((testCase) => {
        assert.deepStrictEqual(new Parser(testCase.inputString).run(), testCase.expression);
      });
    });
    it('should parse logic functions with invalid syntax', () => {
      const testCases = [
        { inputString: '=2<3<4' },
        { inputString: '=2<' },
        { inputString: '=<3' },
        { inputString: '=2! =3' },
        { inputString: '=2=3' },
      ];
      testCases.forEach((testCase) => {
        assert.throws(() => {
          new Parser(testCase.inputString).run();
        }, FormatError);
      });
    });
  });
  describe('#parseExpr()', () => {
    it('should parse valid summarizing functions', () => {
      assert.deepStrictEqual(new Parser('= 2 + 2 ').run(), EW.sum(EW.makeNumber(2), EW.makeNumber(2)));
    });
    it('should parse valid subtractive functions', () => {
      assert.deepStrictEqual(new Parser('= 2 - 2 ').run(), EW.sub(EW.makeNumber(2), EW.makeNumber(2)));
    });
  });
  describe('#parseTerm()', () => {
    it('should parse valid multiplying functions', () => {
      assert.deepStrictEqual(new Parser('= 2 * 2').run(), EW.mul(EW.makeNumber(2), EW.makeNumber(2)));
    });
    it('should parse valid dividing functions', () => {
      assert.deepStrictEqual(new Parser('= 13 / 27').run(), EW.div(EW.makeNumber(13), EW.makeNumber(27)));
    });
    it('should parse valid residual  functions', () => {
      assert.deepStrictEqual(new Parser('= 13 % 27 ').run(), EW.rem(EW.makeNumber(13), EW.makeNumber(27)));
    });
  });
  describe('#parseFactor()', () => {
    it('should parse valid power functions', () => {
      assert.deepStrictEqual(new Parser('= 2 ^ 10').run(), EW.exp(EW.makeNumber(2), EW.makeNumber(10)));
    });
  });
  describe('#parsePower() && #parseArgs()', () => {
    it('should parse valid bracket sequence', () => {
      assert.deepStrictEqual(new Parser('=(( ((2)) + ( ((2) ))) )').run(), EW.sum(EW.makeNumber(2), EW.makeNumber(2)));
    });
    it('should parse invalid bracket sequence', () => {
      assert.throws(() => {
        new Parser('=((1+1)+1)+1)+1').run();
      }, FormatError);
    });
    it('should parse valid functions with unary minus', () => {
      assert.deepStrictEqual(new Parser('=-1').run(), EW.unMinus(EW.makeNumber(1)));
      assert.deepStrictEqual(new Parser('= ( -  2  )  ^   3   ').run(), EW.exp(EW.unMinus(EW.makeNumber(2)), EW.makeNumber(3)));
      assert.deepStrictEqual(new Parser('= 5 * ( - 5 ) ').run(), EW.mul(EW.makeNumber(5), EW.unMinus(EW.makeNumber(5))));
    });
    it('should parse validity function name', () => {
      assert.deepStrictEqual(new Parser('= СУММА ( 1  ; 2  ) ').run(), EW.makeFuncWithArgs('СУММА', EW.makeNumber(1), EW.makeNumber(2)));
      assert.deepStrictEqual(new Parser('=КОРЕНЬ(5)').run(), EW.makeFuncWithArgs('КОРЕНЬ', EW.makeNumber(5)));
      assert.deepStrictEqual(new Parser('=ЛЮБЛЮПИСАТЬТЕСТЫ()').run(), EW.makeFunc('ЛЮБЛЮПИСАТЬТЕСТЫ'));
    });
    it('should parse validity expression', () => {
      assert.deepStrictEqual(new Parser('= ФУНК ( 0 ^ 0 ; 2  ) ').run(),
        EW.makeFuncWithArgs('ФУНК', EW.exp(EW.makeNumber(0), EW.makeNumber(0)), EW.makeNumber(2)));
    });
    it('should parse invalidity function name', () => {
      const testCases = [
        { inputString: '=СУММА' },
        { inputString: '=КОРЕНЬ(5' },
        { inputString: '=КОРЕНЬ(5;0' },
      ];
      testCases.forEach((testCase) => {
        assert.throws(() => {
          new Parser(testCase.inputString).run();
        }, FormatError);
      });
    });
  });
  describe('#parseNum()', () => {
    it('should parse valid number', () => {
      const testCases = [
        { inputString: '=3.1415926', outputValue: EW.makeNumber(3.1415926) },
        { inputString: '=-2.71828182', outputValue: EW.unMinus(EW.makeNumber(2.71828182)) },
        { inputString: '=1.618033988', outputValue: EW.makeNumber(1.618033988) },
      ];
      testCases.forEach((testCase) => {
        assert.deepStrictEqual(new Parser(testCase.inputString).run(), testCase.outputValue);
      });
    });
    it('should parse invalid number', () => {
      const testCases = [
        { inputString: '=3.' },
        { inputString: '=-2."' },
        { inputString: '=1.g' },
      ];
      testCases.forEach((testCase) => {
        assert.throws(() => {
          new Parser(testCase.inputString).run();
        }, FormatError);
      });
    });
  });
  describe('#parseStr()', () => {
    it('should parse valid strings', () => {
      assert.deepStrictEqual(new Parser('="A"+1+":B"+2').run(),
        EW.sum(EW.sum(EW.sum(EW.makeString('A'), EW.makeNumber(1)), EW.makeString(':B')), EW.makeNumber(2)));
    });
    it('should parse invalid strings', () => {
      const testCases = [
        { inputString: '="a' },
        { inputString: '="a""b"' },
        { inputString: '=b"' },
      ];
      testCases.forEach((testCase) => {
        assert.throws(() => {
          new Parser(testCase.inputString).run();
        }, FormatError);
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
      const testCases = [
        { inputString: '=*' },
        { inputString: '=~' },
        { inputString: '=^' },
      ];
      testCases.forEach((testCase) => {
        assert.throws(() => {
          new Parser(testCase.inputString).run();
        }, FormatError);
      });
    });
    it('should parse valid interval', () => {
      assert.deepStrictEqual(new Parser('=A2:B8').run(), EW.makeInterval(EW.makeAddress('A', 2, 0, 1), EW.makeAddress('B', 8, 1, 7)));
    });
    it('should parse invalid interval', () => {
      assert.throws(() => {
        new Parser('=A2:B').run();
      }, FormatError);
      assert.throws(() => {
        new Parser('=A2:').run();
      }, FormatError);
    });
  });
});
