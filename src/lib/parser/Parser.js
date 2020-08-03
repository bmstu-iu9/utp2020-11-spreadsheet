import EW from './ExpressionWrapper.js';
import FormatError from '../../errors/FormatError.js';

const toInt = (a) => a.charCodeAt();

export default class Parser {
  constructor(inputString) {
    this.inputString = inputString;
    this.pos = 0;
  }

  static makeParserError(str) {
    throw new FormatError(`Parser: error in "${str}"!`);
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

  // <Block> ::= =<Equals> | clearValue .
  parseBlock() {
    if (this.checkGet('=')) {
      return this.parseEquals();
    }
    this.pos = this.inputString.length;
    return EW.makeClearValue(this.inputString);
  }

  // <Equals> ::= <Exrp><_Equals>
  parseEquals() {
    return this.parseEqualsHelper(this.parseExpr());
  }

  // <_Equals> ::= EqOp <Expr> | .
  parseEqualsHelper(res) {
    let op = 0;
    if (this.checkGet('!')) {
      if (!this.checkGet('=')) {
        Parser.makeParserError('parseEqualsHelper (only !)');
      } else {
        op = (x, y) => EW.notEqual(x, y);
      }
    } else if (this.checkGet('=')) {
      if (!this.checkGet('=')) {
        Parser.makeParserError('parseEqualsHelper (only =)');
      } else {
        op = (x, y) => EW.equal(x, y);
      }
    } else if (this.checkGet('>')) {
      if (this.checkGet('=')) {
        op = (x, y) => EW.greaterEqual(x, y);
      } else {
        op = (x, y) => EW.greater(x, y);
      }
    } else if (this.checkGet('<')) {
      if (this.checkGet('=')) {
        op = (x, y) => EW.lessEqual(x, y);
      } else {
        op = (x, y) => EW.less(x, y);
      }
    } else {
      return res;
    }
    const res2 = this.parseExpr();
    return op(res, res2);
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
      return this.parseTermHelper(EW.div(res, this.parseFactor()));
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

  // <Power> ::= value | (<Expr>) | unaryMinus Power | nameFunc (<Args> .
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
      const func = EW.makeFunc(this.parseNameFunc());
      if (!this.checkGet('(')) {
        Parser.makeParserError('parsePower (no argument)');
      }
      return this.parseArgs(func);
    } return this.parseValue();
  }

  // <Args> ::= <Expr><_Args> | ) .
  parseArgs(func) {
    if (this.checkGet(')')) {
      return func;
    }
    EW.addArgFunc(func, this.parseEquals());
    return this.parseArgsHelper(func);
  }

  // <_Args> ::= ;<Expr><_Args> | ) .
  parseArgsHelper(func) {
    if (this.checkGet(';')) {
      EW.addArgFunc(func, this.parseEquals());
      return this.parseArgsHelper(func);
    } if (this.checkGet(')')) {
      return func;
    }
    return Parser.makeParserError('parseArgsHelper');
  }

  // value: string | number | address | interval
  // interval: address:address
  parseValue() {
    if (this.hasNext() && (this.get() === '"')) {
      return this.parseStr();
    } if (this.hasNext() && this.get() >= '0' && this.get() <= '9') {
      return EW.makeNumber(this.parseInt());
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
  parseInt() {
    return this.parseFromTo('0', '9', (res, c) => res * 10 + toInt(c) - toInt('0'), 0);
  }

  // nameFunc: [А-Я]*
  parseNameFunc() {
    return this.parseFromTo('А', 'Я', (res, c) => res + c, '');
  }

  // address: ($)[A-Z]*($)[0-9]*
  parseAddress() {
    this.checkGet('$');
    const ind1 = this.parseFromTo('A', 'Z', (res, c) => res + c, '');
    this.checkGet('$');
    const ind2 = this.parseInt();
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
    return EW.makeString(res);
  }

  run() {
    const ans = this.parseBlock();
    if (this.pos < this.inputString.length) {
      Parser.makeParserError('run');
    }
    return ans;
  }
}
