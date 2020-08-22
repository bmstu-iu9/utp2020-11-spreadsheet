import * as assert from 'assert';
import sinon from 'sinon';
import Request from '../../../client/js/requests/Request.js';
import RequestAuthorizer from '../../../client/js/requests/RequestAuthorizer.js';
import PatchWorkbookIdRequest from '../../../client/js/requests/PatchWorkbookIdRequest.js';
import UnauthorizedError from '../../../lib/errors/UnanuthorizedError.js';

describe('PatchWorkbookIdRequest', () => {
  before(() => {
    global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
  });
  after(() => {
    global.XMLHttpRequest.restore();
  });

  const baseUrl = 'localhost';
  const authorizer = new RequestAuthorizer('be1ad7cc-e755-4952-ab76-e79b4345d607');
  const request = new PatchWorkbookIdRequest(baseUrl, authorizer);
  const commits = [
    {
      ID: 'cf3c1cf6-be2f-4a6a-b69b-97b9c1126065',
      changeType: 'color',
      cellAddress: 'A1',
      color: '#aaaaaa',
      page: 0,
    },
  ];
  const conflictCommits = [
    {
      ID: 'a67a8ec6-4741-4fbc-b8e9-3ac69ec96559',
      changeType: 'value',
      cellAddress: 'A2',
      type: 'formula',
      value: '=2+2',
      page: 0,
    },
  ];

  it('should be a child of Request', () => {
    assert.strictEqual(request instanceof Request, true);
  });

  describe('#send()', () => {
    it('should successfully send changes', () => {
      let called = false;
      global.XMLHttpRequest.onCreate = (req) => {
        const spy = sinon.spy(req, 'open');
        req.send = (actualCommits) => {
          called = true;
          assert.deepStrictEqual(JSON.parse(actualCommits), commits);
          assert.strictEqual(spy.calledOnceWith('PATCH', `${baseUrl}/workbook/1`), true);
          req.respond(200);
        };
      };
      const result = request.send(1, commits);
      assert.strictEqual(called, true);
      assert.deepStrictEqual(result, []);
    });
    it('should return conflicts', () => {
      global.XMLHttpRequest.onCreate = (req) => {
        req.send = () => {
          req.respond(409, { 'Content-Type': 'application/json' }, JSON.stringify(conflictCommits));
        };
      };
      const result = request.send(1, commits);
      assert.deepStrictEqual(result, conflictCommits);
    });
    it('should throw UnauthorizedError', () => {
      global.XMLHttpRequest.onCreate = (req) => {
        req.send = () => {
          req.respond(401);
        };
      };
      assert.throws(() => {
        request.send(1, commits);
      }, UnauthorizedError);
    });
  });
});
