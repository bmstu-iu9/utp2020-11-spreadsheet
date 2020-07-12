import DefaultType from './DefaultType.js';
import StringType from './StringType.js';

export default class NumberType extends DefaultType {
  static getType() {
    return 'number';
  }

  sum(valueType) {
    switch (valueType.getType()) {
      case 'number': return new NumberType(this.value + valueType.value);
      case 'string': return new StringType(this.value + valueType.value);
      default: throw new TypeError(`NumberType: imposible type for sum() with ${valueType.getType()}`);
    }
  }

  sub(valueType) {
    switch (valueType.getType()) {
      case 'number': return new NumberType(this.value - valueType.value);
      default: throw new TypeError(`NumberType: imposible type for sub() with ${valueType.getType()}`);
    }
  }

  mul(valueType) {
    switch (valueType.getType()) {
      case 'number': return new NumberType(this.value * valueType.value);
      default: throw new TypeError(`NumberType: imposible type for mul() with ${valueType.getType()}`);
    }
  }

  del(valueType) {
    switch (valueType.getType()) {
      case 'number': return new NumberType(this.value / valueType.value);
      default: throw new TypeError(`NumberType: imposible type for del() with ${valueType.getType()}`);
    }
  }

  rem(valueType) {
    switch (valueType.getType()) {
      case 'number': if (this.value % valueType.value === 0) {
        return new NumberType(this.value % valueType.value);
      }
        throw new TypeError('NumberType: imposible type for rem() with float');
      default: throw new TypeError(`NumberType: imposible type for rem() with ${valueType.getType()}`);
    }
  }

  exp(valueType) {
    return (b == null ? a : ['^', a, b]);
  }

  unMinus(a) {
    return ['-', a];
  }
}
