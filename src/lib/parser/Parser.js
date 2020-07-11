const sum = (a, b) => a + b;
const sub = (a, b) => a - b;
const mul = (a, b) => a * b;
const del = (a, b) => a / b;
const rem = (a, b) => a % b;
const exp = (a, b) => (b == null ? a : a ** b);
const unMinus = (a) => -a;

const equal = (a, b) => a === b;
const more = (a, b) => a > b;

const makeFunc = (func, args) => [func, args];
const makeInterval = (a1, a2) => [a1, a2];
const makeAddress = (a) => a;

// все команды написанные выше - условны, являются заглушками

const toInt = (a) => a.charCodeAt();

export default class Parser {
  constructor(inputString) {
    this.inputString = inputString;
    this.pos = 0;
  }

  static makeParserError(str) { throw new SyntaxError(`Parser syntax error in ${str}!`); }

  next() { this.pos += 1; }

  hasNext() { return this.pos < this.inputString.length; }

  get() { return this.hasNext() ? this.inputString[this.pos] : Parser.makeParserError('get'); }

  checkGet(c) {
    const res = this.hasNext() && (this.get() === c);
    if (res) this.next();
    return res;
  }

  parseBlock() {
    if (this.checkGet('=')) return this.parseEquals();
    this.pos = this.inputString.length;
    return this.inputString;
  }

  parseEquals() { return this.parseEqualsHelper(this.parseExpr()); }

  parseEqualsHelper(res) { // 1 == | 2 >= | 3 > | 4 <= | 5 < | 6 !=
    let op = 0;
    if (this.checkGet('!')) {
      if (!this.checkGet('=')) Parser.makeParserError('parseEqualsHelper (only !)');
      else op = 6;
    } else if (this.checkGet('=')) {
      if (!this.checkGet('=')) Parser.makeParserError('parseEqualsHelper (only =)');
      else op = 1;
    } else if (this.checkGet('>')) {
      if (this.checkGet('=')) op = 2;
      else op = 3;
    } else if (this.checkGet('<')) {
      if (this.checkGet('=')) op = 4;
      else op = 5;
    } else return res;
    const res2 = this.parseExpr();
    switch (op) {
      case 1: return equal(res, res2);
      case 2: return !more(res2, res);
      case 3: return more(res, res2);
      case 4: return !more(res, res2);
      case 5: return more(res2, res);
      default: return !equal(res, res2);
    }
  }

  parseExpr() { return this.parseExprHelper(this.parseTerm()); }

  parseExprHelper(res) {
    if (this.checkGet('-')) return this.parseExprHelper(sub(res, this.parseTerm()));
    if (this.checkGet('+')) return this.parseExprHelper(sum(res, this.parseTerm()));
    return res;
  }

  parseTerm() { return this.parseTermHelper(this.parseFactor()); }

  parseTermHelper(res) {
    if (this.checkGet('*')) return this.parseTermHelper(mul(res, this.parseFactor()));
    if (this.checkGet('/')) return this.parseTermHelper(del(res, this.parseFactor()));
    if (this.checkGet('%')) return this.parseTermHelper(rem(res, this.parseFactor()));
    return res;
  }

  parseFactor() { return exp(this.parsePower(), this.parseFactorHelper()); }

  parseFactorHelper() {
    if (this.checkGet('^')) return exp(this.parsePower(), this.parseFactorHelper());
    return null;
  }

  parsePower() {
    if (this.checkGet('(')) {
      const res = this.parseExpr();
      if (!this.checkGet(')')) Parser.makeParserError('parsePower (wrong bracket sequence)');
      return res;
    } if (this.checkGet('-')) {
      return unMinus(this.parsePower());
    } if (this.hasNext() && this.get() >= 'А' && this.get() <= 'Я') {
      const nameFun = this.parseNameFunc();
      if (!this.checkGet('(')) Parser.makeParserError('parsePower (no argument)');
      const args = this.parseArgs();
      return makeFunc(nameFun, args);
    } return this.parseValue();
  }

  parseArgs() {
    const arr = [];
    if (this.checkGet(')')) return arr;
    arr.push(this.parseExpr());
    return this.parseArgsHelper(arr);
  }

  parseArgsHelper(arr) {
    if (this.checkGet(';')) {
      arr.push(this.parseExpr());
      return this.parseArgsHelper(arr);
    } if (this.checkGet(')')) return arr;
    return Parser.makeParserError('parseArgsHelper');
  }

  parseValue() {
    if (this.hasNext() && (this.get() === '"')) {
      return this.parseStr();
    } if (this.hasNext() && this.get() >= '0' && this.get() <= '9') {
      return this.parseNum();
    } if (this.hasNext() && this.get() >= 'A' && this.get() <= 'Z') {
      const res = makeAddress(this.parseAddress());
      if (this.checkGet(':')) {
        const res2 = makeAddress(this.parseAddress());
        return makeInterval(res, res2);
      }
      return res;
    }
    return Parser.makeParserError('parseValue');
  }

  parseFromTo(from, to, func, start) {
    if (!(this.hasNext() && from <= this.get() && this.get() <= to)) Parser.makeParserError('parseFromTo');
    let res = start;
    while (this.hasNext() && from <= this.get() && this.get() <= to) {
      res = func(res, this.get());
      this.next();
    }
    return res;
  }

  parseNum() { return this.parseFromTo('0', '9', (res, c) => res * 10 + toInt(c) - toInt('0'), 0); }

  parseNameFunc() { return this.parseFromTo('А', 'Я', (res, c) => res + c, ''); }

  parseAddress() {
    this.checkGet('$');
    const ind1 = this.parseFromTo('A', 'Z', (res, c) => res * 26 + toInt(c) - toInt('A'), '');
    this.checkGet('$');
    const ind2 = this.parseNum();
    return [ind1, ind2];
  }

  parseStr() {
    if (!this.checkGet('"')) Parser.makeParserError('parseStr');
    let res = '';
    while (!this.checkGet('"')) {
      res += this.get();
      this.next();
    }
    return res;
  }

  run() {
    const ans = this.parseBlock();
    if (this.pos < this.inputString.length) Parser.makeParserError('run');
    return ans;
  }
}
