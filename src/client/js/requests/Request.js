import RequestAuthorizer from './RequestAuthorizer.js';
import UnauthorizedError from '../../../lib/errors/UnanuthorizedError.js';
import UnknownServerError from '../../../lib/errors/UnknownServerError.js';
import FormatError from '../../../lib/errors/FormatError.js';
import ForbiddenError from '../../../lib/errors/ForbiddenError.js';
import NotFoundError from '../../../lib/errors/NotFoundError.js';
import MethodNotAllowedError from '../../../lib/errors/MethodNotAllowedError.js';
import ConflictError from '../../../lib/errors/ConflictError.js';

export default class Request {
  constructor(baseUrl, authorizer) {
    this.setBaseUrl(baseUrl);
    this.setAuthorizer(authorizer);
  }

  setAuthorizer(authorizer) {
    if (!(authorizer instanceof RequestAuthorizer)) {
      throw new TypeError('authorizer must be an Authorizer instance');
    }
    this.authorizer = authorizer;
  }

  setBaseUrl(baseUrl) {
    if (typeof baseUrl !== 'string') {
      throw new TypeError('baseUrl must be a string');
    }
    this.baseUrl = baseUrl;
  }

  static validateStatusCode(statusCode) {
    switch (statusCode) {
      case 400:
        throw new FormatError('Incorrect format');
      case 401:
        throw new UnauthorizedError();
      case 403:
        throw new ForbiddenError();
      case 404:
        throw new NotFoundError();
      case 405:
        throw new MethodNotAllowedError();
      case 409:
        throw new ConflictError();
      default:
    }
    if (statusCode !== 200) {
      throw new UnknownServerError(statusCode);
    }
  }
}
