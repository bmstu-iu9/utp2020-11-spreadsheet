import sinon from 'sinon';
import * as assert from 'assert';
import RequestAuthorizer from '../../../client/js/requests/RequestAuthorizer.js';
import Request from '../../../client/js/requests/Request.js';
import PostUserRequest from '../../../client/js/requests/PostUserRequest.js';

describe('PostUserRequest', () => {
  const baseUrl = '/';
  const authorizer = new RequestAuthorizer('647d1546-fab5-49a8-8f89-3cdebec4b8be');
  const request = new PostUserRequest(baseUrl, authorizer);

  before(() => {
    global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
  });
  after(() => {
    global.XMLHttpRequest.restore();
  });

  it('should extend Request', () => {
    assert.strictEqual(request instanceof Request, true);
  });

  describe('#send()', () => {
    it('should register new user', () => {
      const username = 'username';
      const password = 'password';
      global.XMLHttpRequest.onCreate = (req) => {
        req.send = (data) => {
          const parsed = JSON.parse(data);
          assert.deepStrictEqual(parsed, { password, username });
          req.respond(200,
            { 'Content-Type': 'application/json' },
            JSON.stringify({ isAdmin: false, username }));
        };
      };
      request.send(username, password);
    });
  });
});
