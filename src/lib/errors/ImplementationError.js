export default class FormatError extends Error {
  constructor() {
    super('Abstract method was not implemented');
    this.name = 'ImplementationError';
  }
}
