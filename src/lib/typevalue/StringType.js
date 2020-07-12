export default class StringType {
  constructor(value) {
    this.value = value;
  }

  sum(valueType) {
    if (valueType instanceof StringType) {
      return new StringType(this.value + valueType.value);
    }
    throw new TypeError('StringType: imposible type for sum() with not StringType');
  }
}
