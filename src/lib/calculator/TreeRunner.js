import NumberType from '../typevalue/NumberType.js';
import StringType from '../typevalue/StringType.js';
import BooleanType from '../typevalue/BooleanType.js';
import FormatError from '../../Errors/FormatError.js';

const libFunc = new Map([
  ['number', (treeRunner) => new NumberType(treeRunner.tree[1])],

  ['string', (treeRunner) => new StringType(treeRunner.tree[1])],

  ['Value', (treeRunner) => {
    const ans = Number(treeRunner.tree[1]);
    return { value: Number.isNaN(ans) ? treeRunner.tree[1] : ans };
  }],

  ['+', (treeRunner) => {
    const res1 = treeRunner.makeTreeRunner(treeRunner.tree[1]).run();
    const res2 = treeRunner.makeTreeRunner(treeRunner.tree[2]).run();
    return res1.sum(res2);
  }],

  ['-', (treeRunner) => {
    const res1 = treeRunner.makeTreeRunner(treeRunner.tree[1]).run();
    const res2 = treeRunner.makeTreeRunner(treeRunner.tree[2]).run();
    return res1.sub(res2);
  }],

  ['*', (treeRunner) => {
    const res1 = treeRunner.makeTreeRunner(treeRunner.tree[1]).run();
    const res2 = treeRunner.makeTreeRunner(treeRunner.tree[2]).run();
    return res1.mul(res2);
  }],

  ['/', (treeRunner) => {
    const res1 = treeRunner.makeTreeRunner(treeRunner.tree[1]).run();
    const res2 = treeRunner.makeTreeRunner(treeRunner.tree[2]).run();
    return res1.div(res2);
  }],

  ['%', (treeRunner) => {
    const res1 = treeRunner.makeTreeRunner(treeRunner.tree[1]).run();
    const res2 = treeRunner.makeTreeRunner(treeRunner.tree[2]).run();
    return res1.rem(res2);
  }],

  ['^', (treeRunner) => {
    const res1 = treeRunner.makeTreeRunner(treeRunner.tree[1]).run();
    const res2 = treeRunner.makeTreeRunner(treeRunner.tree[2]).run();
    return res1.exp(res2);
  }],

  ['unMinus', (treeRunner) => {
    const res1 = treeRunner.makeTreeRunner(treeRunner.tree[1]).run();
    return res1.unMinus();
  }],

  ['==', (treeRunner) => {
    const res1 = treeRunner.makeTreeRunner(treeRunner.tree[1]).run();
    const res2 = treeRunner.makeTreeRunner(treeRunner.tree[2]).run();
    return new BooleanType(res1.equal(res2));
  }],

  ['>=', (treeRunner) => {
    const res1 = treeRunner.makeTreeRunner(treeRunner.tree[1]).run();
    const res2 = treeRunner.makeTreeRunner(treeRunner.tree[2]).run();
    return new BooleanType(res1.greaterEqual(res2));
  }],

  ['>', (treeRunner) => {
    const res1 = treeRunner.makeTreeRunner(treeRunner.tree[1]).run();
    const res2 = treeRunner.makeTreeRunner(treeRunner.tree[2]).run();
    return new BooleanType(res1.greater(res2));
  }],

  ['<=', (treeRunner) => {
    const res1 = treeRunner.makeTreeRunner(treeRunner.tree[1]).run();
    const res2 = treeRunner.makeTreeRunner(treeRunner.tree[2]).run();
    return new BooleanType(res1.lessEqual(res2));
  }],

  ['<', (treeRunner) => {
    const res1 = treeRunner.makeTreeRunner(treeRunner.tree[1]).run();
    const res2 = treeRunner.makeTreeRunner(treeRunner.tree[2]).run();
    return new BooleanType(res1.less(res2));
  }],

  ['!=', (treeRunner) => {
    const res1 = treeRunner.makeTreeRunner(treeRunner.tree[1]).run();
    const res2 = treeRunner.makeTreeRunner(treeRunner.tree[2]).run();
    return new BooleanType(res1.notEqual(res2));
  }],

  ['И', (treeRunner) => {
    let pos = 1;
    let res = new BooleanType(true);
    while (res.value && pos < treeRunner.tree.length) {
      res = treeRunner.makeTreeRunner(treeRunner.tree[pos]).run();
      if (!(res instanceof BooleanType)) {
        BooleanType.makeTypeError('И');
      }
      pos += 1;
    }
    return new BooleanType(res.value);
  }],

  ['ИЛИ', (treeRunner) => {
    let pos = 1;
    let res = new BooleanType(false);
    while (!res.value && pos < treeRunner.tree.length) {
      res = treeRunner.makeTreeRunner(treeRunner.tree[pos]).run();
      if (!(res instanceof BooleanType)) {
        BooleanType.makeTypeError('И');
      }
      pos += 1;
    }
    return new BooleanType(res.value);
  }],

  ['ЕСЛИ', (treeRunner) => {
    if (treeRunner.tree.length - 1 !== 3) {
      treeRunner.constructor.makeFormatError('wrong number arguments in ЕСЛИ');
    }
    const res1 = treeRunner.makeTreeRunner(treeRunner.tree[1]).run();
    if (!(res1 instanceof BooleanType)) {
      treeRunner.constructor.makeTypeError('wrong type arguments in ЕСЛИ');
    }
    return treeRunner.makeTreeRunner(treeRunner.tree[res1.value ? 2 : 3]).run();
  }],
]);

export default class TreeRunner {
  constructor(book, page, tree) {
    this.book = book;
    this.page = page;
    this.tree = tree;
  }

  static makeTypeError(str) {
    throw new TypeError(`TreeRunner: ${str}`);
  }

  static makeFormatError(str) {
    throw new FormatError(`TreeRunner: ${str}`);
  }

  makeTreeRunner(tree) {
    return new TreeRunner(this.book, this.page, tree);
  }

  run() {
    if (!libFunc.has(this.tree[0])) {
      throw new FormatError(`undefined function ${this.tree[0]}`);
    }
    return libFunc.get(this.tree[0])(this);
  }
}
