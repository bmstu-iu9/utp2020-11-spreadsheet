export default class IntervalType {
  constructor(value) {
    this.value = value;
  }

  static makeTypeError(str) {
    throw new TypeError(`IntervalType: impossible type for ${str}() with not IntervalType`);
  }
}
