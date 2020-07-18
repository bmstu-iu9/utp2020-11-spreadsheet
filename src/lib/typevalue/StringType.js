export default class StringType {
  constructor(value) {
    this.value = value;
  }

  sum(valueType) {
    if (valueType instanceof StringType) {
      return new StringType(this.value + valueType.value);
    }
    throw new TypeError('StringType: impossible type for sum() with not StringType');
  }

  equal(valueType) {
    if (valueType instanceof StringType) {
      return (this.value === valueType.value);
    }
    throw StringType.makeTypeError('equal');
  }

  greaterEqual(valueType) {
    if (valueType instanceof StringType) {
      return (this.value >= valueType.value);
    }
    throw StringType.makeTypeError('greaterEqual');
  }

  greater(valueType) {
    if (valueType instanceof StringType) {
      return (this.value > valueType.value);
    }
    throw StringType.makeTypeError('greater');
  }

  lessEqual(valueType) {
    if (valueType instanceof StringType) {
      return (this.value <= valueType.value);
    }
    throw StringType.makeTypeError('lessEqual');
  }

  less(valueType) {
    if (valueType instanceof StringType) {
      return (this.value < valueType.value);
    }
    throw StringType.makeTypeError('less');
  }

  notEqual(valueType) {
    if (valueType instanceof StringType) {
      return (this.value !== valueType.value);
    }
    throw StringType.makeTypeError('notEqual');
  }
}
