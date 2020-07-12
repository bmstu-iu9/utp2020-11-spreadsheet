import NumberType from '../typevalue/NumberType.js';

const libFunc = new Map([
  ['integer', (treeRunner) => new NumberType(treeRunner.tree[1])],

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
    return res1.mul(res2);
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
    if (!Array.isArray(this.tree)) {
      return this.tree;
    }
    if (!libFunc.has(this.tree[0])) {
      throw new TypeError(`TreeRunner: undefind function ${this.tree[0]}`);
    }
    return libFunc.get(this.tree[0])(this);
  }
}
