import UuidValidator from '../../../lib/uuid/UuidValidator.js';

export default class XhrAuthorizer {
  constructor(token) {
    this.setToken(token);
  }

  setToken(token) {
    if (!UuidValidator.isUuidValid(token)) {
      throw new TypeError('token must be a valid UUID');
    }
    this.token = token;
  }

  authorize(request) {
    request.setRequestHeader('Authorization', `Token ${this.token}`);
  }
}
