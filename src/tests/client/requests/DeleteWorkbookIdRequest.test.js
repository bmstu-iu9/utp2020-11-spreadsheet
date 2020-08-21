import * as assert from 'assert';
import sinon from 'sinon';
import Request from '../../../client/js/requests/Request.js';
import DeleteWorkbookIdRequest from '../../../client/js/requests/DeleteWorkbookIdRequest.js';
import RequestAuthorizer from '../../../client/js/requests/RequestAuthorizer.js';
import UnauthorizedError from '../../../lib/errors/UnanuthorizedError.js';

describe('DeleteWorkbookIdRequest', () => {
  const baseUrl = 'localhost';
  const authenticator = new RequestAuthorizer('9bc21cca-4965-48d2-b41e-608d99dce4fc');
  const request = new DeleteWorkbookIdRequest(baseUrl, authenticator);

  before(() => {
    global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
  });
  after(() => {
    global.XMLHttpRequest.restore();
  });

  it('should be a child of Request', () => {
    assert.strictEqual(request instanceof Request, true);
  });

  describe('#send()', () => {
    it('should send a delete request', () => {
      let called = false;
      global.XMLHttpRequest.onCreate = (req) => {
        const spy = sinon.spy(req, 'open');
        req.send = () => {
          spy.calledOnceWith('DELETE', `${baseUrl}/workbook/1`);
          called = true;
          req.respond(200);
        };
      };
      request.send();
      assert.strictEqual(called, true);
    });
    it('should throw UnauthorizedError', () => {
      global.XMLHttpRequest.onCreate = (req) => {
        req.send = () => {
          req.respond(401);
        };
      };
      assert.throws(() => {
        request.send();
      }, UnauthorizedError);
    });
  });
});
