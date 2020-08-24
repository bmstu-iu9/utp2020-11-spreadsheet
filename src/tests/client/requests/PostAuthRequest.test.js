import sinon from 'sinon';
import * as assert from 'assert';
import RequestAuthorizer from '../../../client/js/requests/RequestAuthorizer.js';
import Request from '../../../client/js/requests/Request.js';
import PostAuthRequest from '../../../client/js/requests/PostAuthRequest.js';
import TokenModel from '../../../server/database/TokenModel.js';

describe('PostAuthRequest', () => {
  const baseUrl = '/';
  const token = '647d1546-fab5-49a8-8f89-3cdebec4b8be';
  const authorizer = new RequestAuthorizer(token);
  const request = new PostAuthRequest(baseUrl, authorizer);

  before(() => {
    global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
  });
  after(() => {
    global.XMLHttpRequest.restore();
  });

  it('should extend Request', () => {
    assert.strictEqual(request instanceof Request, true);
  });

  describe('#send', () => {
    it('should return TokenModel', () => {
      const username = 'username';
      const password = 'password';
      global.XMLHttpRequest.onCreate = (req) => {
        req.send = (data) => {
          const parsed = JSON.parse(data);
          assert.deepStrictEqual(parsed, { password, username });
          req.respond(200,
            { 'Content-Type': 'application/json' },
            JSON.stringify({ token }));
        };
      };
      const result = request.send(username, password);
      assert.deepStrictEqual(result, new TokenModel(username, token));
    });
  });
});
