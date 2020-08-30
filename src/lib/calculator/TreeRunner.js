import NumberType from '../typevalue/NumberType.js';
import StringType from '../typevalue/StringType.js';
import BooleanType from '../typevalue/BooleanType.js';
import IntervalType from '../typevalue/IntervalType.js';
import FormatError from '../errors/FormatError.js';
import { Cell } from '../spreadsheets/Cell.js';

const libFunc = new Map([
  ['number', (treeRunner) => new NumberType(treeRunner.tree[1])],

  ['string', (treeRunner) => new StringType(treeRunner.tree[1])],

  ['Value', (treeRunner) => {
    const ans = Number(treeRunner.tree[1]);
    return { value: Number.isNaN(ans) ? treeRunner.tree[1] : ans };
  }],

  ['Interval', (treeRunner) => {
    treeRunner.constructor.makeTypeError('trying to calculate the Interval');
  }],

  ['Address', (treeRunner) => (Cell.isEmptyCell(treeRunner.tree[1]) ? new NumberType(0)
    : treeRunner.book.getProcessedValue(treeRunner.tree[1], treeRunner.page))],

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

  ['_И', (treeRunner) => {
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

  ['_ИЛИ', (treeRunner) => {
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

  ['_ЕСЛИ', (treeRunner) => {
    if (treeRunner.tree.length - 1 !== 3) {
      treeRunner.constructor.makeFormatError('wrong number arguments in ЕСЛИ');
    }
    const res1 = treeRunner.makeTreeRunner(treeRunner.tree[1]).run();
    if (!(res1 instanceof BooleanType)) {
      treeRunner.constructor.makeTypeError('wrong type arguments in ЕСЛИ');
    }
    return treeRunner.makeTreeRunner(treeRunner.tree[res1.value ? 2 : 3]).run();
  }],

  ['_КОРЕНЬ', (treeRunner) => {
    if (treeRunner.tree.length - 1 !== 1) {
      treeRunner.constructor.makeFormatError('wrong number arguments in КОРЕНЬ');
    }
    const res = treeRunner.makeTreeRunner(treeRunner.tree[1]).run();
    return res.exp(new NumberType(1 / 2));
  }],

  ['_СУММА', (treeRunner) => {
    let res = new NumberType(0);
    treeRunner.tree.slice(1).forEach((element) => {
      (element[0] === 'Interval'
        ? new IntervalType(element).getArrayAddresses()
        : [element])
        .forEach((element2) => {
          res = res.sum(treeRunner.makeTreeRunner(element2).run());
        });
    });
    return res;
  }],

  ['_ПРОИЗВЕД', (treeRunner) => {
    let res = new NumberType(1);
    treeRunner.tree.slice(1).forEach((element) => {
      (element[0] === 'Interval'
        ? new IntervalType(element).getArrayAddresses()
        : [element])
        .forEach((element2) => {
          res = res.mul(treeRunner.makeTreeRunner(element2).run());
        });
    });
    return res;
  }],

  ['_СЧЁТ', (treeRunner) => {
    let res = new NumberType(0);
    treeRunner.tree.slice(1).forEach((element) => {
      if (element[0] !== 'Interval') {
        IntervalType.makeTypeError('СЧЁТ');
      }
      res = res.sum(new NumberType(new IntervalType(element).getArrayAddresses()
        .filter((address) => !Cell.isEmptyCell(treeRunner.book
          .spreadsheets[treeRunner.page].getCell(address[1]))).length));
    });
    return res;
  }],

  ['_СЧЁТЕСЛИ', (treeRunner) => {
    if (treeRunner.tree.length - 1 !== 2) {
      treeRunner.constructor.makeFormatError('wrong number arguments in СЧЁТЕСЛИ');
    }
    if (treeRunner.tree[1][0] !== 'Interval') {
      IntervalType.makeTypeError('СЧЁТЕСЛИ');
    }
    const checkRes = treeRunner.makeTreeRunner(treeRunner.tree[2]).run();
    let res = new NumberType(0);
    new IntervalType(treeRunner.tree[1]).getArrayAddresses()
      .filter((address) => !Cell.isEmptyCell(treeRunner.book
        .spreadsheets[treeRunner.page].getCell(address[1])
        && treeRunner.makeTreeRunner(address).run() === checkRes)
      .forEach((element2) => {
        res = res.sum(treeRunner.makeTreeRunner(element2).run());
      });
    return res;
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
