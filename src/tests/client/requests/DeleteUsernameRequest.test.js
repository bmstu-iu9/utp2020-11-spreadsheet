import sinon from 'sinon';
import * as assert from 'assert';
import RequestAuthorizer from '../../../client/js/requests/RequestAuthorizer.js';
import Request from '../../../client/js/requests/Request.js';
import DeleteUsernameRequest from '../../../client/js/requests/DeleteUsernameRequest.js';

describe('DeleteUsernameRequest', () => {
  const baseUrl = 'localhost';
  const authorizer = new RequestAuthorizer('a3b7755b-931b-4913-8c68-ddbb2e61e320');
  const request = new DeleteUsernameRequest(baseUrl, authorizer);

  before(() => {
    global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
  });

  after(() => {
    global.XMLHttpRequest.restore();
  });

  it('should be a child of Request', () => {
    assert.strictEqual(request instanceof Request, true);
  });

  describe('#send', () => {
    it('should send a delete request', () => {
      let called = false;
      global.XMLHttpRequest.onCreate = (req) => {
        const openSpy = sinon.spy(req, 'open');
        req.send = () => {
          openSpy.calledOnceWith('DELETE', `${baseUrl}/user/username`);
          called = true;
          req.respond(200);
        };
      };
      const authorizerSpy = sinon.spy(authorizer, 'authorize');
      request.send('username');
      assert.strictEqual(called, true);
      assert.strictEqual(authorizerSpy.calledOnce, true);
    });
  });
});
