import sinon from 'sinon';
import * as assert from 'assert';
import RequestAuthorizer from '../../../client/js/requests/RequestAuthorizer.js';
import Request from '../../../client/js/requests/Request.js';
import GetUsernameRequest from '../../../client/js/requests/GetUsernameRequest.js';
import UserModel from '../../../server/database/UserModel.js';

describe('GetUsernameRequest', () => {
  const baseUrl = 'localhost';
  const authorizer = new RequestAuthorizer('a3b7755b-931b-4913-8c68-ddbb2e61e320');
  const request = new GetUsernameRequest(baseUrl, authorizer);

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
    it('should return UserModel', () => {
      const username = 'login';
      const isAdmin = false;
      const expected = new UserModel(username, isAdmin);
      let called = false;
      global.XMLHttpRequest.onCreate = (req) => {
        const openSpy = sinon.spy(req, 'open');
        req.send = () => {
          openSpy.calledOnceWith('GET', `${baseUrl}/user/${username}`);
          const data = JSON.stringify(UserModel.fromUserToJSON(expected));
          req.respond(200, { 'Content-Type': 'application/json' }, data);
          called = true;
        };
      };
      const authorizerSpy = sinon.spy(authorizer, 'authorize');
      const user = request.send(username);
      assert.strictEqual(called, true);
      assert.deepStrictEqual(user, expected);
      assert.strictEqual(authorizerSpy.calledOnce, true);
    });
  });
});
