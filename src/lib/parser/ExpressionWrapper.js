export default class ExpressionWrapper {
  static makeInterval(a1, a2) {
    return ['Interval', a1, a2];
  }

  static makeAddress(a1, a2) {
    return ['Address', a1 + a2];
  }

  static makeClearValue(a) {
    return ['Value', a];
  }

  static makeNumber(a) {
    return ['Number', a];
  }

  static makeString(a) {
    return ['String', a];
  }

  static sum(a, b) {
    return ['+', a, b];
  }

  static sub(a, b) {
    return ['-', a, b];
  }

  static mul(a, b) {
    return ['*', a, b];
  }

  static del(a, b) {
    return ['/', a, b];
  }

  static rem(a, b) {
    return ['%', a, b];
  }

  static exp(a, b) {
    return (b == null ? a : ['^', a, b]);
  }

  static unMinus(a) {
    return ['-', a];
  }

  static equal(a, b) {
    return ['==', a, b];
  }

  static greaterEqual(a, b) {
    return ['>=', a, b];
  }

  static greater(a, b) {
    return ['>', a, b];
  }

  static lessEqual(a, b) {
    return ['<=', a, b];
  }

  static less(a, b) {
    return ['<', a, b];
  }

  static notEqual(a, b) {
    return ['!=', a, b];
  }

  static makeFunc(func) {
    return [func];
  }

  static makeFuncWithArgs(func, ...args) {
    return [func, ...args];
  }

  static addArgFunc(func, arg) {
    func.push(arg);
    return func;
  }
}
