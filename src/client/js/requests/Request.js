import RequestAuthorizer from './RequestAuthorizer.js';

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
}
