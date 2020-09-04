export default class WrongSecondPasswordError extends Error {
  constructor(message) {
    super(message);
    this.name = 'WrongSecondPasswordError';
  }
}
