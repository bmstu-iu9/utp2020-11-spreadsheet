export default class DefaultType {
  constructor(value) {
    this.value = value;
  }

  static getType() {
    return 'indefind';
  }

  static sum(valueType) {
    throw new TypeError(`DefaultType: imposible type for sum() with ${valueType.getType()}`);
  }

  static sub(valueType) {
    throw new TypeError(`DefaultType: imposible type for sub() with ${valueType.getType()}`);
  }

  static mul(valueType) {
    throw new TypeError(`DefaultType: imposible type for mul() with ${valueType.getType()}`);
  }
}
