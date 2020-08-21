export default class ConflictError extends Error {
  constructor() {
    super('Conflict was detected');
    this.name = 'ConflictError';
  }
}
