export default class NotImplementedError extends Error {
  constructor(errorClass) {
    super(`Abstract method of class ${errorClass.name} was not implemented`);
    this.name = 'NotImplementedError';
  }
}
