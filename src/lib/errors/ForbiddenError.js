export default class ForbiddenError extends Error {
  constructor() {
    super('Access is forbidden');
    this.name = 'ForbiddenError';
  }
}
