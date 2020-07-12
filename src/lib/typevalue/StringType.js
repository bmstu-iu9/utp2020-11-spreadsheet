import DefaultType from './DefaultType.js';

export default class StringType extends DefaultType {
  static getType() {
    return 'string';
  }

  sum(valueType) {
    switch (valueType.getType()) {
      case 'number': case 'string': return new StringType(this.value + valueType.value);
      default: throw new TypeError(`StringType: imposible type for sum() with ${valueType.getType()}`);
    }
  }

  static sub(valueType) {
    throw new TypeError(`StringType: imposible type for sub() with ${valueType.getType()}`);
  }

  static mul(valueType) {
    throw new TypeError(`IntegerType: imposible type for mul() with ${valueType.getType()}`);
  }
}
