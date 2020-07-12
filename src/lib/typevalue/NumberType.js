export default class NumberType {
  constructor(value) {
    this.value = value;
  }

  static makeTypeError(str) {
    throw new TypeError(`NumberType: imposible type for ${str}() with not NumberType`);
  }

  sum(valueType) {
    if (valueType instanceof NumberType) {
      return new NumberType(this.value + valueType.value);
    }
    throw NumberType.makeTypeError('sum');
  }

  sub(valueType) {
    if (valueType instanceof NumberType) {
      return new NumberType(this.value - valueType.value);
    }
    throw NumberType.makeTypeError('sub');
  }

  mul(valueType) {
    if (valueType instanceof NumberType) {
      return new NumberType(this.value * valueType.value);
    }
    throw NumberType.makeTypeError('mul');
  }

  div(valueType) {
    if (valueType instanceof NumberType) {
      return new NumberType(this.value / valueType.value);
    }
    throw NumberType.makeTypeError('div');
  }

  rem(valueType) {
    if (valueType instanceof NumberType
      && Number.isInteger(this.value) && Number.isInteger(valueType.value)) {
      return new NumberType(this.value % valueType.value);
    }
    throw NumberType.makeTypeError('rem');
  }

  exp(valueType) {
    if (valueType instanceof NumberType) {
      return new NumberType(this.value ** valueType.value);
    }
    throw NumberType.makeTypeError('exp');
  }

  unMinus() {
    return new NumberType(-this.value);
  }
}
