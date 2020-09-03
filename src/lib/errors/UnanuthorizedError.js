export default class UnauthorizedError extends Error {
  constructor(message = 'Unable to authorize') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}
