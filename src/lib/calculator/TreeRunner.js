import NumberType from '../typevalue/NumberType.js';
import StringType from '../typevalue/StringType.js';

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
]);

export default class TreeRunner {
  constructor(book, page, tree) {
    this.book = book;
    this.page = page;
    this.tree = tree;
  }

  makeTreeRunner(tree) {
    return new TreeRunner(this.book, this.page, tree);
  }

  run() {
    if (!libFunc.has(this.tree[0])) {
      throw new TypeError(`TreeRunner: undefind function ${this.tree[0]}`);
    }
    return libFunc.get(this.tree[0])(this);
  }
}
