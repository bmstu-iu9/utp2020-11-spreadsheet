import * as assert from 'assert';
import sinon from 'sinon';
import RequestAuthorizer from '../../../client/js/requests/RequestAuthorizer.js';
import Request from '../../../client/js/requests/Request.js';
import UserModel from '../../../server/database/UserModel.js';
import PatchUsernameRequest from '../../../client/js/requests/PatchUsernameRequest.js';

describe('PatchUsernameRequest', () => {
  before(() => {
    global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
  });
  after(() => {
    global.XMLHttpRequest.restore();
  });

  const baseUrl = 'localhost';
  const authorizer = new RequestAuthorizer('be1ad7cc-e755-4952-ab76-e79b4345d607');
  const request = new PatchUsernameRequest(baseUrl, authorizer);

  it('should be a child of Request', () => {
    assert.strictEqual(request instanceof Request, true);
  });

  describe('#send()', () => {
    it('should return UserModel', () => {
      let called = false;
      const username = 'username';
      const password = 'password';
      const isAdmin = false;
      const user = new UserModel(username, isAdmin);
      global.XMLHttpRequest.onCreate = (req) => {
        const openSpy = sinon.spy(req, 'open');
        req.send = (userData) => {
          openSpy.calledOnceWith('PATCH', `${baseUrl}/user/${username}`);
          assert.deepStrictEqual(userData, JSON.stringify({ isAdmin, password }));
          const data = UserModel.fromUserToJSON(user);
          req.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(data));
          called = true;
        };
      };
      const result = request.send(username, isAdmin, password);
      assert.strictEqual(called, true);
      assert.deepStrictEqual(result, user);
    });
  });
});
