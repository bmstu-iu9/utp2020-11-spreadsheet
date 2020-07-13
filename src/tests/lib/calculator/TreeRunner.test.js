import * as assert from 'assert';
import TR from '../../../lib/calculator/TreeRunner.js';
import WB from '../../../lib/spreadsheets/Workbook.js';
import Parser from '../../../lib/parser/Parser.js';

describe('TreeRunner', () => {
  describe('#constructor()', () => {
    it('should make new element', () => {
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=(1+5^(1/2))/2').run()),
        { book: new WB('book'), page: 0, tree: new Parser('=(1+5^(1/2))/2').run() });
      assert.deepEqual(new TR(new WB('asdff'), 1344, new Parser('=1+1').run()),
        { book: new WB('asdff'), page: 1344, tree: new Parser('=1+1').run() });
    });
  });
  describe('#makeTreeRunner()', () => {
    it('should derive new element', () => {
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=(1+5^(1/2))/2').run()).makeTreeRunner(new Parser('=1+1').run()),
        { book: new WB('book'), page: 0, tree: new Parser('=1+1').run() });
      assert.deepEqual(new TR(new WB('asdff'), 1344, new Parser('=1+1').run()).makeTreeRunner(new Parser('=(1+5^(1/2))/2').run()),
        { book: new WB('asdff'), page: 1344, tree: new Parser('=(1+5^(1/2))/2').run() });
    });
  });
  describe('#run()', () => {
    it('should calculate invalid expression', () => {
      assert.throws(() => {
        new TR(new WB('book'), 0, new Parser('=СТРАННАЯФУНКЦИЯ(0/0;2;"a"/5)').run()).run();
      });
    });
    it('should calculate integer', () => {
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=10').run()).run(), { value: 10 });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=1241532').run()).run(), { value: 1241532 });
    });
    it('should calculate string', () => {
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('="akshdj"').run()).run(), { value: 'akshdj' });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('="9a8oe7hytviyf"').run()).run(), { value: '9a8oe7hytviyf' });
    });
    it('should calculate value', () => {
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('askd ;j mfa,F:m;').run()).run(), { value: 'askd ;j mfa,F:m;' });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('456789876').run()).run(), { value: '456789876' });
    });
    it('should calculate sum()', () => {
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=324+92380').run()).run(), { value: 324 + 92380 });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('="asdfg"+"lkas"').run()).run(), { value: 'asdfglkas' });
    });
    it('should calculate sub()', () => {
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=324-92380').run()).run(), { value: 324 - 92380 });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=79883-9783').run()).run(), { value: 79883 - 9783 });
    });
    it('should calculate mul()', () => {
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=324*92380').run()).run(), { value: 324 * 92380 });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=79883*9783').run()).run(), { value: 79883 * 9783 });
    });
    it('should calculate div()', () => {
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=324/92380').run()).run(), { value: 324 / 92380 });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=79883/9783').run()).run(), { value: 79883 / 9783 });
    });
    it('should calculate rem()', () => {
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=324%92380').run()).run(), { value: 324 % 92380 });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=79883%9783').run()).run(), { value: 79883 % 9783 });
    });
    it('should calculate exp()', () => {
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=324^92380').run()).run(), { value: 324 ** 92380 });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=79883^9783').run()).run(), { value: 79883 ** 9783 });
    });
    it('should calculate unMinus()', () => {
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=-92380').run()).run(), { value: -92380 });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=-9783').run()).run(), { value: -9783 });
    });
    it('should calculate equal()', () => {
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=3==4').run()).run(), { value: 3 === 4 });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=4==4').run()).run(), { value: true });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=5==4').run()).run(), { value: 5 === 4 });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('="asdfg"=="lkas"').run()).run(), { value: 'asdfg' === 'lkas' });
    });
    it('should calculate greaterEqual()', () => {
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=3>=4').run()).run(), { value: 3 >= 4 });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=4>=4').run()).run(), { value: true });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=5>=4').run()).run(), { value: 5 >= 4 });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('="asdfg">="lkas"').run()).run(), { value: 'asdfg' >= 'lkas' });
    });
    it('should calculate greater()', () => {
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=3>4').run()).run(), { value: 3 > 4 });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=4>4').run()).run(), { value: false });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=5>4').run()).run(), { value: 5 > 4 });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('="asdfg">"lkas"').run()).run(), { value: 'asdfg' > 'lkas' });
    });
    it('should calculate lessEqual()', () => {
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=3<=4').run()).run(), { value: 3 <= 4 });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=4<=4').run()).run(), { value: true });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=5<=4').run()).run(), { value: 5 <= 4 });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('="asdfg"<="lkas"').run()).run(), { value: 'asdfg' <= 'lkas' });
    });
    it('should calculate less()', () => {
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=3<4').run()).run(), { value: 3 < 4 });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=4<4').run()).run(), { value: false });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=5<4').run()).run(), { value: 5 < 4 });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('="asdfg"<"lkas"').run()).run(), { value: 'asdfg' < 'lkas' });
    });
    it('should calculate notEqual()', () => {
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=3!=4').run()).run(), { value: 3 !== 4 });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=4!=4').run()).run(), { value: false });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=5!=4').run()).run(), { value: 5 !== 4 });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('="asdfg"!="lkas"').run()).run(), { value: 'asdfg' !== 'lkas' });
    });
    it('should calculate И()', () => {
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=И()').run()).run(), { value: true });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=И(1==1;5/2==10/4)').run()).run(), { value: true });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=И(1==1;5/2==10/3)').run()).run(), { value: false });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=И(1==5;5/2==10/4)').run()).run(), { value: false });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=И(1==5;"gregdfsg")').run()).run(), { value: false });
      assert.throws(() => {
        new TR(new WB('book'), 0, new Parser('=И(1==1;"gregdfsg")').run()).run();
      });
    });
    it('should calculate ИЛИ()', () => {
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=ИЛИ()').run()).run(), { value: false });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=ИЛИ(1==1;5/2==10/4)').run()).run(), { value: true });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=ИЛИ(1==5;5/2==10/4)').run()).run(), { value: true });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=ИЛИ(1==5;5/2==10/3)').run()).run(), { value: false });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=ИЛИ(1==1;"gregdfsg")').run()).run(), { value: true });
      assert.throws(() => {
        new TR(new WB('book'), 0, new Parser('=ИЛИ(1==5;"gregdfsg")').run()).run();
      });
    });
    it('should calculate ЕСЛИ()', () => {
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=ЕСЛИ(1==1;1;2)').run()).run(), { value: 1 });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=ЕСЛИ(1==5;1;2)').run()).run(), { value: 2 });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=ЕСЛИ(1==1;"true";"gregdfsg"*8)').run()).run(), { value: 'true' });
      assert.deepEqual(new TR(new WB('book'), 0, new Parser('=ЕСЛИ(1==5;"gregdfsg"*8;"false")').run()).run(), { value: 'false' });
      assert.throws(() => {
        new TR(new WB('book'), 0, new Parser('=ЕСЛИ()').run()).run();
      });
      assert.throws(() => {
        new TR(new WB('book'), 0, new Parser('=ЕСЛИ(1;2)').run()).run();
      });
      assert.throws(() => {
        new TR(new WB('book'), 0, new Parser('=ЕСЛИ(1;2;3)').run()).run();
      });
      assert.throws(() => {
        new TR(new WB('book'), 0, new Parser('=ЕСЛИ(1;2;3;4)').run()).run();
      });
      assert.throws(() => {
        new TR(new WB('book'), 0, new Parser('=ЕСЛИ(1==5;"true";"gregdfsg"*8)').run()).run();
      });
      assert.throws(() => {
        new TR(new WB('book'), 0, new Parser('=ЕСЛИ(1==1;"gregdfsg"*8;"false")').run()).run();
      });
    });
  });
});
