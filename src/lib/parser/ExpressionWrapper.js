export default class EW {
  static sum(a, b) {
    return a + b;
  }

  static sub(a, b) {
    return a - b;
  }

  static mul(a, b) {
    return a * b;
  }

  static del(a, b) {
    return a / b;
  }

  static rem(a, b) {
    return a % b;
  }

  static exp(a, b) {
    return (b == null ? a : a ** b);
  }

  static unMinus(a) {
    return -a;
  }

  static equal(a, b) {
    return a === b;
  }

  static more(a, b) {
    return a > b;
  }

  static makeFunc(func, args) {
    return [func, args];
  }

  static makeInterval(a1, a2) {
    return [a1, a2];
  }

  static makeAddress(a) {
    return a;
  }
}
