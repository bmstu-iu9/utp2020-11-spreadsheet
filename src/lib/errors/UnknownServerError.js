export default class UnknownServerError extends Error {
  constructor(code) {
    super(`Unknown server error. Status code: ${code}`);
    this.name = 'UnknownServerError';
  }
}
