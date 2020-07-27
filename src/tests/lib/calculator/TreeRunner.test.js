/* eslint-disable no-self-compare */
import * as assert from 'assert';
import TreeRunner from '../../../lib/calculator/TreeRunner.js';
import Workbook from '../../../lib/spreadsheets/Workbook.js';
import Parser from '../../../lib/parser/Parser.js';

const book = new Workbook('book');
describe('TreeRunner', () => {
  describe('#constructor()', () => {
    it('Should make new element', () => {
      const tree = new Parser('=(1+5^(1/2))/2').run();
      const treeRunner = new TreeRunner(book, 0, tree);
      assert.strictEqual(treeRunner.book, book);
      assert.strictEqual(treeRunner.page, 0);
      assert.strictEqual(treeRunner.tree, tree);
    });
  });
  describe('#makeTreeRunner()', () => {
    it('Should derive new element', () => {
      const tree = new Parser('=(1+5^(1/2))/2').run();
      const treeRunner = new TreeRunner(book, 0, null);
      const newTreeRunner = treeRunner.makeTreeRunner(tree);
      assert.strictEqual(newTreeRunner.book, book);
      assert.strictEqual(newTreeRunner.page, 0);
      assert.strictEqual(newTreeRunner.tree, tree);
    });
  });
  describe('#run()', () => {
    it('Should throw error because of invalid expression', () => {
      assert.throws(() => {
        new TreeRunner(book, 0, new Parser('=СТРАННАЯФУНКЦИЯ(0/0;2;"a"/5)').run()).run();
      });
    });
    const testCasesWithoutError = [{
      description: 'Should calculate integer',
      parserExpression: '=10',
      result: 10,
    },
    {
      description: 'Should calculate string',
      parserExpression: '="string"',
      result: 'string',
    },
    {
      description: 'Should calculate value in number form',
      parserExpression: 'askd ;j mfa,F:m;',
      result: 'askd ;j mfa,F:m;',
    },
    {
      description: 'Should calculate value in other form',
      parserExpression: '456789876',
      result: 456789876,
    },
    {
      description: 'Should calculate sum() of two numbers',
      parserExpression: '=10+100',
      result: 110,
    },
    {
      description: 'Should calculate sum() of two strings',
      parserExpression: '="str"+"ing"',
      result: 'string',
    },
    {
      description: 'Should calculate sub() of two numbers',
      parserExpression: '=100-90',
      result: 10,
    },
    {
      description: 'Should calculate mul() of two numbers',
      parserExpression: '=10*100',
      result: 1000,
    },
    {
      description: 'Should calculate div() of two numbers',
      parserExpression: '=100/10',
      result: 100 / 10,
    },
    {
      description: 'Should calculate rem()',
      parserExpression: '=50%3',
      result: 50 % 3,
    },
    {
      description: 'Should calculate exp()',
      parserExpression: '=2^3',
      result: 2 ** 3,
    },
    {
      description: 'Should calculate unMinus()',
      parserExpression: '=-10',
      result: -10,
    },
    {
      description: 'Should calculate equal() different numbers',
      parserExpression: '=3==4',
      result: 3 === 4,
    },
    {
      description: 'Should calculate equal() equal numbers',
      parserExpression: '=4==4',
      result: 4 === 4,
    },
    {
      description: 'Should calculate equal() different strings',
      parserExpression: '="abc"=="abcd"',
      result: 'abc' === 'abcd',
    },
    {
      description: 'Should calculate equal() equal strings',
      parserExpression: '="abc"=="abc"',
      result: 'abc' === 'abc',
    },
    {
      description: 'Should calculate greaterEqual() with not equal numbers',
      parserExpression: '=3>=4',
      result: 3 >= 4,
    },
    {
      description: 'Should calculate greaterEqual() with equal numbers',
      parserExpression: '=4>=4',
      result: 4 >= 4,
    },
    {
      description: 'Should calculate greaterEqual() with not equal strings',
      parserExpression: '="abc">="abcd"',
      result: 'abc' >= 'abcd',
    },
    {
      description: 'Should calculate greaterEqual() with equal strings',
      parserExpression: '="abc">="abc"',
      result: 'abs' >= 'abs',
    },
    {
      description: 'Should calculate greater with numbers',
      parserExpression: '=3>4',
      result: 3 > 4,
    },
    {
      description: 'Should calculate greater with strings',
      parserExpression: '="abcd">"abc"',
      result: 'abcd' > 'abc',
    },
    {
      description: 'Should calculate lessEqual() with not equal numbers',
      parserExpression: '=3<=4',
      result: 3 <= 4,
    },
    {
      description: 'Should calculate lessEqual() with equal numbers',
      parserExpression: '=4<=4',
      result: 4 <= 4,
    },
    {
      description: 'Should calculate lessEqual() with not equal strings',
      parserExpression: '="abc"<="abcd"',
      result: 'abc' <= 'abcd',
    },
    {
      description: 'Should calculate lessEqual() with equal strings',
      parserExpression: '="abc"<="abc"',
      result: 'abs' <= 'abs',
    },
    {
      description: 'Should calculate less with numbers',
      parserExpression: '=3<4',
      result: 3 < 4,
    },
    {
      description: 'Should calculate less with strings',
      parserExpression: '="abcd"<"abc"',
      result: 'abcd' < 'abc',
    },
    {
      description: 'Should calculate notEqual() different numbers',
      parserExpression: '=3!=4',
      result: 3 !== 4,
    },
    {
      description: 'Should calculate notEqual() equal numbers',
      parserExpression: '=4!=4',
      result: 4 !== 4,
    },
    {
      description: 'Should calculate notEqual() different strings',
      parserExpression: '="abc"!="abcd"',
      result: 'abc' !== 'abcd',
    },
    {
      description: 'Should calculate notEqual() equal strings',
      parserExpression: '="abc"!="abc"',
      result: 'abc' !== 'abc',
    },
    {
      description: 'Should calculate И() without expressions',
      parserExpression: '=И()',
      result: true,
    },
    {
      description: 'Should calculate И() with true expressions',
      parserExpression: '=И(1==1;2==2)',
      result: 1 === 1 && 2 === 2,
    },
    {
      description: 'Should calculate И() with one true and one false expressions',
      parserExpression: '=И(1==1;2==1)',
      result: 1 === 1 && 2 === 1,
    },
    {
      description: 'Should calculate И() with false expressions',
      parserExpression: '=И(1==2;1==3)',
      result: 1 === 2 && 1 === 3,
    },
    {
      description: 'Should calculate И() with false expression and not boolean expression',
      parserExpression: '=И(1==5;"gregdfsg")',
      result: false,
    },
    {
      description: 'Should calculate ИЛИ() without expressions',
      parserExpression: '=ИЛИ()',
      result: false,
    },
    {
      description: 'Should calculate ИЛИ() with two true expressions',
      parserExpression: '=ИЛИ(1==1;2==2)',
      result: 1 === 1 || 2 === 2,
    },
    {
      description: 'Should calculate ИЛИ() with two false expressions',
      parserExpression: '=ИЛИ(1==2;2==3)',
      result: 1 === 2 || 2 === 3,
    },
    {
      description: 'Should calculate ИЛИ() with one false and one true expressions',
      parserExpression: '=ИЛИ(1==1;1==2)',
      result: 1 === 1 || 1 === 2,
    },
    {
      description: 'Should calculate ИЛИ() with true expression and not boolean expression',
      parserExpression: '=ИЛИ(1==1;"string")',
      result: true,
    },
    {
      description: 'Should calculate ЕСЛИ() with true expression',
      parserExpression: '=ЕСЛИ(1==1;1;2)',
      result: 1,
    },
    {
      description: 'Should calculate ЕСЛИ() with false expression',
      parserExpression: '=ЕСЛИ(1==2;1;2)',
      result: 2,
    },
    {
      description: 'Should calculate ЕСЛИ() with true expression and error in another branch',
      parserExpression: '=ЕСЛИ(1==1;1;"string"*2)',
      result: 1,
    },
    ];
    testCasesWithoutError.forEach((testCase) => {
      it(testCase.description, () => {
        const tree = new Parser(testCase.parserExpression).run();
        const treeRunner = new TreeRunner(book, 0, tree);
        assert.strictEqual(treeRunner.run().value, testCase.result);
      });
    });
    const testCasesWithError = [{
      description: 'Should throw error in И() because an invalid expression started evaluating',
      parserExpression: '=И(1==1;"string")',
    },
    {
      description: 'Should throw error in ИЛИ() because an invalid expression started evaluating',
      parserExpression: '=ИЛИ(1==5;"string")',
    },
    {
      description: 'Should throw error in ЕСЛИ() because has zero arguments',
      parserExpression: '=ЕСЛИ()',
    },
    {
      description: 'Should throw error in ЕСЛИ() because an invalid syntax',
      parserExpression: '=ЕСЛИ(1;2;3)',
    },
    {
      description: 'Should throw error in ЕСЛИ() because an invalid expression started evaluating',
      parserExpression: '=ЕСЛИ(1==1;"string"*2;"false")',
    },
    ];
    testCasesWithError.forEach((testCase) => {
      it(testCase.description, () => {
        const tree = new Parser(testCase.parserExpression).run();
        const treeRunner = new TreeRunner(book, 0, tree);
        assert.throws(() => treeRunner.run());
      });
    });
  });
});
