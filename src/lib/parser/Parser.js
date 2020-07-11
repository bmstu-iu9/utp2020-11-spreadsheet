import EW from './ExpressionWrapper.js';

const toInt = (a) => a.charCodeAt();

export default class Parser {
  constructor(inputString) {
    this.inputString = inputString;
    this.pos = 0;
  }

  static makeParserError(str) {
    throw new SyntaxError(`Parser SyntaxError in "${str}"!`);
  }

  next() {
    this.pos += 1;
  }

  hasNext() {
    return this.pos < this.inputString.length;
  }

  get() {
    return this.hasNext() ? this.inputString[this.pos] : Parser.makeParserError('get');
  }

  checkGet(c) {
    const res = this.hasNext() && (this.get() === c);
    if (res) {
      this.next();
    }
    return res;
  }

  // <Block> ::= =<Equals> | this .
  parseBlock() {
    if (this.checkGet('=')) {
      return this.parseEquals();
    }
    this.pos = this.inputString.length;
    return this.inputString;
  }

  // <Equals> ::= <Exrp><_Equals>
  parseEquals() {
    return this.parseEqualsHelper(this.parseExpr());
  }

  // <_Equals> ::= EqOp <Expr> | .
  parseEqualsHelper(res) { // 1 == | 2 >= | 3 > | 4 <= | 5 < | 6 !=
    let op = 0;
    if (this.checkGet('!')) {
      if (!this.checkGet('=')) {
        Parser.makeParserError('parseEqualsHelper (only !)');
      } else {
        op = 6;
      }
    } else if (this.checkGet('=')) {
      if (!this.checkGet('=')) {
        Parser.makeParserError('parseEqualsHelper (only =)');
      } else {
        op = 1;
      }
    } else if (this.checkGet('>')) {
      if (this.checkGet('=')) {
        op = 2;
      } else {
        op = 3;
      }
    } else if (this.checkGet('<')) {
      if (this.checkGet('=')) {
        op = 4;
      } else {
        op = 5;
      }
    } else {
      return res;
    }
    const res2 = this.parseExpr();
    switch (op) {
      case 1: return EW.equal(res, res2);
      case 2: return !EW.more(res2, res);
      case 3: return EW.more(res, res2);
      case 4: return !EW.more(res, res2);
      case 5: return EW.more(res2, res);
      default: return !EW.equal(res, res2);
    }
  }

  // <Expr> ::= <Term><_Expr>.
  parseExpr() {
    return this.parseExprHelper(this.parseTerm());
  }

  // <_Expr> ::= AddOp <Term><_Expr> | .
  parseExprHelper(res) {
    if (this.checkGet('-')) {
      return this.parseExprHelper(EW.sub(res, this.parseTerm()));
    }
    if (this.checkGet('+')) {
      return this.parseExprHelper(EW.sum(res, this.parseTerm()));
    }
    return res;
  }

  // <Term> ::= <Factor> <_Term> .
  parseTerm() {
    return this.parseTermHelper(this.parseFactor());
  }

  // <_Term> ::= MulOp <Factor> <_Term> | .
  parseTermHelper(res) {
    if (this.checkGet('*')) {
      return this.parseTermHelper(EW.mul(res, this.parseFactor()));
    }
    if (this.checkGet('/')) {
      return this.parseTermHelper(EW.del(res, this.parseFactor()));
    }
    if (this.checkGet('%')) {
      return this.parseTermHelper(EW.rem(res, this.parseFactor()));
    }
    return res;
  }

  // <Factor> ::= <Power> <_Factor> .
  parseFactor() {
    return EW.exp(this.parsePower(), this.parseFactorHelper());
  }

  // <_Factor> ::= PowOp <Power> <_Factor> | .
  parseFactorHelper() {
    if (this.checkGet('^')) {
      return EW.exp(this.parsePower(), this.parseFactorHelper());
    }
    return null;
  }

  // <Power> ::= value | (<Expr>) | unaryMinus Power | NameFunc (<Args> .
  parsePower() {
    if (this.checkGet('(')) {
      const res = this.parseExpr();
      if (!this.checkGet(')')) {
        Parser.makeParserError('parsePower (wrong bracket sequence)');
      }
      return res;
    } if (this.checkGet('-')) {
      return EW.unMinus(this.parsePower());
    } if (this.hasNext() && this.get() >= 'А' && this.get() <= 'Я') {
      const nameFun = this.parseNameFunc();
      if (!this.checkGet('(')) {
        Parser.makeParserError('parsePower (no argument)');
      }
      const args = this.parseArgs();
      return EW.makeFunc(nameFun, args);
    } return this.parseValue();
  }

  // <Args> ::= <Expr><_Args> | ) .
  parseArgs() {
    const arr = [];
    if (this.checkGet(')')) {
      return arr;
    }
    arr.push(this.parseExpr());
    return this.parseArgsHelper(arr);
  }

  // <_Args> ::= ;<Expr><_Args> | ) .
  parseArgsHelper(arr) {
    if (this.checkGet(';')) {
      arr.push(this.parseExpr());
      return this.parseArgsHelper(arr);
    } if (this.checkGet(')')) {
      return arr;
    }
    return Parser.makeParserError('parseArgsHelper');
  }

  // value: string | number | address | interval
  // interval: address:address
  parseValue() {
    if (this.hasNext() && (this.get() === '"')) {
      return this.parseStr();
    } if (this.hasNext() && this.get() >= '0' && this.get() <= '9') {
      return this.parseNum();
    } if (this.hasNext() && this.get() >= 'A' && this.get() <= 'Z') {
      const res = this.parseAddress();
      if (this.checkGet(':')) {
        const res2 = this.parseAddress();
        return EW.makeInterval(res, res2);
      }
      return res;
    }
    return Parser.makeParserError('parseValue');
  }

  parseFromTo(from, to, func, start) {
    if (!(this.hasNext() && from <= this.get() && this.get() <= to)) {
      Parser.makeParserError('parseFromTo');
    }
    let res = start;
    while (this.hasNext() && from <= this.get() && this.get() <= to) {
      res = func(res, this.get());
      this.next();
    }
    return res;
  }

  // number: [0-9]*
  parseNum() {
    return this.parseFromTo('0', '9', (res, c) => res * 10 + toInt(c) - toInt('0'), 0);
  }

  // NameFunc: [А-Я]*
  parseNameFunc() {
    return this.parseFromTo('А', 'Я', (res, c) => res + c, '');
  }

  // address: ($)[A-Z]*($)[0-9]*
  parseAddress() {
    this.checkGet('$');
    const ind1 = this.parseFromTo('A', 'Z', (res, c) => res * 26 + toInt(c) - toInt('A'), '');
    this.checkGet('$');
    const ind2 = this.parseNum() - 1;
    return EW.makeAddress(ind1, ind2);
  }

  // string: "..."
  parseStr() {
    if (!this.checkGet('"')) {
      Parser.makeParserError('parseStr');
    }
    let res = '';
    while (!this.checkGet('"')) {
      res += this.get();
      this.next();
    }
    return res;
  }

  run() {
    const ans = this.parseBlock();
    if (this.pos < this.inputString.length) {
      Parser.makeParserError('run');
    }
    return ans;
  }
}
