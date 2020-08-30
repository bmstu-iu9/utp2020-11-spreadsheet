/* eslint-disable no-self-compare */
// self-comparison is necessary to check the comparison function
import * as assert from 'assert';
import TreeRunner from '../../../lib/calculator/TreeRunner.js';
import Workbook from '../../../lib/spreadsheets/Workbook.js';
import Parser from '../../../lib/parser/Parser.js';
import FormatError from '../../../lib/errors/FormatError.js';
import { Cell, valueTypes } from '../../../lib/spreadsheets/Cell.js';

const book = new Workbook('book');
book.createSpreadsheet('lublu mamu');
describe('TreeRunner', () => {
  describe('#constructor()', () => {
    it('should make new element', () => {
      const tree = new Parser('=(1+5^(1/2))/2').run();
      const treeRunner = new TreeRunner(book, 0, tree);
      assert.strictEqual(treeRunner.book, book);
      assert.strictEqual(treeRunner.page, 0);
      assert.strictEqual(treeRunner.tree, tree);
    });
  });
  describe('#makeTreeRunner()', () => {
    it('should derive new element', () => {
      const tree = new Parser('=(1+5^(1/2))/2').run();
      const treeRunner = new TreeRunner(book, 0, null);
      const newTreeRunner = treeRunner.makeTreeRunner(tree);
      assert.strictEqual(newTreeRunner.book, book);
      assert.strictEqual(newTreeRunner.page, 0);
      assert.strictEqual(newTreeRunner.tree, tree);
    });
  });
  describe('#run()', () => {
    it('should throw error because of invalid expression', () => {
      assert.throws(() => {
        new TreeRunner(book, 0, new Parser('=СТРАННАЯФУНКЦИЯ(0/0;2;"a"/5)').run()).run();
      }, FormatError);
    });
    const testCasesWithoutError = [{
      description: 'should calculate integer',
      parserExpression: '=10',
      result: 10,
    },
    {
      description: 'should calculate string',
      parserExpression: '="string"',
      result: 'string',
    },
    {
      description: 'should calculate value in number form',
      parserExpression: 'askd ;j mfa,F:m;',
      result: 'askd ;j mfa,F:m;',
    },
    {
      description: 'should calculate value in other form',
      parserExpression: '456789876',
      result: 456789876,
    },
    {
      description: 'should calculate sum() of two numbers',
      parserExpression: '=10+100',
      result: 110,
    },
    {
      description: 'should calculate sum() of two strings',
      parserExpression: '="str"+"ing"',
      result: 'string',
    },
    {
      description: 'should calculate sub() of two numbers',
      parserExpression: '=100-90',
      result: 10,
    },
    {
      description: 'should calculate mul() of two numbers',
      parserExpression: '=10*100',
      result: 1000,
    },
    {
      description: 'should calculate div() of two numbers',
      parserExpression: '=100/10',
      result: 100 / 10,
    },
    {
      description: 'should calculate rem()',
      parserExpression: '=50%3',
      result: 50 % 3,
    },
    {
      description: 'should calculate exp()',
      parserExpression: '=2^3',
      result: 2 ** 3,
    },
    {
      description: 'should calculate unMinus()',
      parserExpression: '=-10',
      result: -10,
    },
    {
      description: 'should calculate equal() different numbers',
      parserExpression: '=3==4',
      result: 3 === 4,
    },
    {
      description: 'should calculate equal() equal numbers',
      parserExpression: '=4==4',
      result: 4 === 4,
    },
    {
      description: 'should calculate equal() different strings',
      parserExpression: '="abc"=="abcd"',
      result: 'abc' === 'abcd',
    },
    {
      description: 'should calculate equal() equal strings',
      parserExpression: '="abc"=="abc"',
      result: 'abc' === 'abc',
    },
    {
      description: 'should calculate greaterEqual() with not equal numbers',
      parserExpression: '=3>=4',
      result: 3 >= 4,
    },
    {
      description: 'should calculate greaterEqual() with equal numbers',
      parserExpression: '=4>=4',
      result: 4 >= 4,
    },
    {
      description: 'should calculate greaterEqual() with not equal strings',
      parserExpression: '="abc">="abcd"',
      result: 'abc' >= 'abcd',
    },
    {
      description: 'should calculate greaterEqual() with equal strings',
      parserExpression: '="abc">="abc"',
      result: 'abs' >= 'abs',
    },
    {
      description: 'should calculate greater with numbers',
      parserExpression: '=3>4',
      result: 3 > 4,
    },
    {
      description: 'should calculate greater with strings',
      parserExpression: '="abcd">"abc"',
      result: 'abcd' > 'abc',
    },
    {
      description: 'should calculate lessEqual() with not equal numbers',
      parserExpression: '=3<=4',
      result: 3 <= 4,
    },
    {
      description: 'should calculate lessEqual() with equal numbers',
      parserExpression: '=4<=4',
      result: 4 <= 4,
    },
    {
      description: 'should calculate lessEqual() with not equal strings',
      parserExpression: '="abc"<="abcd"',
      result: 'abc' <= 'abcd',
    },
    {
      description: 'should calculate lessEqual() with equal strings',
      parserExpression: '="abc"<="abc"',
      result: 'abs' <= 'abs',
    },
    {
      description: 'should calculate less with numbers',
      parserExpression: '=3<4',
      result: 3 < 4,
    },
    {
      description: 'should calculate less with strings',
      parserExpression: '="abcd"<"abc"',
      result: 'abcd' < 'abc',
    },
    {
      description: 'should calculate notEqual() different numbers',
      parserExpression: '=3!=4',
      result: 3 !== 4,
    },
    {
      description: 'should calculate notEqual() equal numbers',
      parserExpression: '=4!=4',
      result: 4 !== 4,
    },
    {
      description: 'should calculate notEqual() different strings',
      parserExpression: '="abc"!="abcd"',
      result: 'abc' !== 'abcd',
    },
    {
      description: 'should calculate notEqual() equal strings',
      parserExpression: '="abc"!="abc"',
      result: 'abc' !== 'abc',
    },
    {
      description: 'should calculate И() without expressions',
      parserExpression: '=И()',
      result: true,
    },
    {
      description: 'should calculate И() with true expressions',
      parserExpression: '=И(1==1;2==2)',
      result: 1 === 1 && 2 === 2,
    },
    {
      description: 'should calculate И() with one true and one false expressions',
      parserExpression: '=И(1==1;2==1)',
      result: 1 === 1 && 2 === 1,
    },
    {
      description: 'should calculate И() with false expressions',
      parserExpression: '=И(1==2;1==3)',
      result: 1 === 2 && 1 === 3,
    },
    {
      description: 'should calculate И() with false expression and not boolean expression',
      parserExpression: '=И(1==5;"gregdfsg")',
      result: false,
    },
    {
      description: 'should calculate ИЛИ() without expressions',
      parserExpression: '=ИЛИ()',
      result: false,
    },
    {
      description: 'should calculate ИЛИ() with two true expressions',
      parserExpression: '=ИЛИ(1==1;2==2)',
      result: 1 === 1 || 2 === 2,
    },
    {
      description: 'should calculate ИЛИ() with two false expressions',
      parserExpression: '=ИЛИ(1==2;2==3)',
      result: 1 === 2 || 2 === 3,
    },
    {
      description: 'should calculate ИЛИ() with one false and one true expressions',
      parserExpression: '=ИЛИ(1==1;1==2)',
      result: 1 === 1 || 1 === 2,
    },
    {
      description: 'should calculate ИЛИ() with true expression and not boolean expression',
      parserExpression: '=ИЛИ(1==1;"string")',
      result: true,
    },
    {
      description: 'should calculate ЕСЛИ() with true expression',
      parserExpression: '=ЕСЛИ(1==1;1;2)',
      result: 1,
    },
    {
      description: 'should calculate ЕСЛИ() with false expression',
      parserExpression: '=ЕСЛИ(1==2;1;2)',
      result: 2,
    },
    {
      description: 'should calculate ЕСЛИ() with true expression and error in another branch',
      parserExpression: '=ЕСЛИ(1==1;1;"string"*2)',
      result: 1,
    },
    {
      description: 'should calculate КОРЕНЬ()',
      parserExpression: '=КОРЕНЬ(4)',
      result: 2,
    },
    {
      description: 'should calculate СУММА() with number',
      parserExpression: '=СУММА(1; 2; 3; 4)',
      result: 10,
    },
    {
      description: 'should calculate ПРОИЗВЕД() with number',
      parserExpression: '=ПРОИЗВЕД(1; 2; 3; 4)',
      result: 24,
    },
    ];
    testCasesWithoutError.forEach((testCase) => {
      it(testCase.description, () => {
        const tree = new Parser(testCase.parserExpression).run();
        const treeRunner = new TreeRunner(book, 0, tree);
        assert.strictEqual(treeRunner.run().value, testCase.result);
      });
    });
    const testCasesWithTypeError = [{
      description: 'should calculate Interval()',
      parserExpression: '=A1:B2',
    },
    {
      description: 'should throw error in И() because an invalid expression started evaluating',
      parserExpression: '=И(1==1;"string")',
    },
    {
      description: 'should throw error in ИЛИ() because an invalid expression started evaluating',
      parserExpression: '=ИЛИ(1==5;"string")',
    },
    {
      description: 'should throw error in ЕСЛИ() because an invalid expression started evaluating',
      parserExpression: '=ЕСЛИ(1==1;"string"*2;"false")',
    },
    {
      description: 'should throw error in ЕСЛИ() because an invalid syntax',
      parserExpression: '=ЕСЛИ(1;2;3)',
    },
    ];
    testCasesWithTypeError.forEach((testCase) => {
      it(testCase.description, () => {
        const tree = new Parser(testCase.parserExpression).run();
        const treeRunner = new TreeRunner(book, 0, tree);
        assert.throws(() => treeRunner.run(), TypeError);
      });
    });
    const testCasesWithFormatError = [{
      description: 'should throw error in ЕСЛИ() because has zero arguments',
      parserExpression: '=ЕСЛИ()',
    },
    {
      description: 'should calculate КОРЕНЬ() because has two arguments',
      parserExpression: '=КОРЕНЬ(3; 4)',
    },
    ];
    testCasesWithFormatError.forEach((testCase) => {
      it(testCase.description, () => {
        const tree = new Parser(testCase.parserExpression).run();
        const treeRunner = new TreeRunner(book, 0, tree);
        assert.throws(() => treeRunner.run(), FormatError);
      });
    });
    it('should calculate СЧЁТ()', () => {
      book.spreadsheets[0].setCells(new Map([
        ['A1', new Cell(valueTypes.number, 5)],
        ['A2', new Cell(valueTypes.formula, '=A1*2')],
        ['A3', new Cell(valueTypes.number, 8)],
      ]));
      const tree = new Parser('=СЧЁТ(A1:B4)').run();
      const treeRunner = new TreeRunner(book, 0, tree);
      assert.deepStrictEqual(treeRunner.run().value, 3);
    });
  });
});
