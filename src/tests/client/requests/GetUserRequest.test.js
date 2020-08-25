import sinon from 'sinon';
import * as assert from 'assert';
import RequestAuthorizer from '../../../client/js/requests/RequestAuthorizer.js';
import Request from '../../../client/js/requests/Request.js';
import GetUserRequest from '../../../client/js/requests/GetUserRequest.js';
import UserModel from '../../../server/database/UserModel.js';

describe('GetUserRequest', () => {
  before(() => {
    global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
  });
  after(() => {
    global.XMLHttpRequest.restore();
  });

  const baseUrl = 'https://example.com';
  const authorizer = new RequestAuthorizer('f546a652-e0cf-4718-b77d-9dec4a9b4e5c');
  const request = new GetUserRequest(baseUrl, authorizer);

  it('should be a child of Request', () => {
    assert.strictEqual(request instanceof Request, true);
  });
  describe('#send()', () => {
    it('should return user array', () => {
      const user1 = new UserModel('absd', false);
      const user2 = new UserModel('test', true);
      global.XMLHttpRequest.onCreate = (req) => {
        req.send = () => {
          req.respond(200, {
            'Content-Type': 'application/json',
          },
          JSON.stringify(UserModel.fromUsersToJSON([user1, user2])));
        };
      };
      const response = request.send();
      assert.deepStrictEqual(response, [user1, user2]);
    });
  });
});
