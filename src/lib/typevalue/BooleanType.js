export default class BooleanType {
  constructor(value) {
    this.value = value;
  }

  static makeTypeError(str) {
    throw new TypeError(`BooleanType: impossible type for ${str}() with not BooleanType`);
  }
}
