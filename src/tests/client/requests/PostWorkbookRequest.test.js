import * as assert from 'assert';
import sinon from 'sinon';
import Request from '../../../client/js/requests/Request.js';
import Workbook from '../../../lib/spreadsheets/Workbook.js';
import WorkbookId from '../../../lib/spreadsheets/WorkbookId.js';
import PostWorkbookRequest from '../../../client/js/requests/PostWorkbookRequest.js';
import WorkbookDeserializer from '../../../lib/serialization/WorkbookDeserializer.js';
import WorkbookIdSerializer from '../../../lib/serialization/WorkbookIdSerializer.js';
import RequestAuthorizer from '../../../client/js/requests/RequestAuthorizer.js';
import UnauthorizedError from '../../../lib/errors/UnanuthorizedError.js';

describe('PostWorkbookRequest', () => {
  const workbook = new Workbook('test');
  const workbookId = new WorkbookId(workbook, 1, '87fa52ba-0d54-4ee7-b695-63aefd373e23');
  const baseUrl = '/';
  const authorizer = new RequestAuthorizer('647d1546-fab5-49a8-8f89-3cdebec4b8be');
  const request = new PostWorkbookRequest(baseUrl, authorizer);

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
    it('should return created workbook', () => {
      global.XMLHttpRequest.onCreate = (req) => {
        req.send = (data) => {
          const serialized = JSON.parse(data);
          const deserialized = WorkbookDeserializer.deserialize(serialized);
          assert.deepStrictEqual(deserialized, workbook);
          req.respond(200,
            { 'Content-Type': 'application/json' },
            JSON.stringify(WorkbookIdSerializer.serialize(workbookId)));
        };
      };
      const authorizerSpy = sinon.spy(authorizer, 'authorize');
      const created = request.send(workbook);
      assert.deepStrictEqual(created, workbookId);
      assert.strictEqual(authorizerSpy.calledOnce, true);
    });
    it('should throw UnauthorizedError', () => {
      global.XMLHttpRequest.onCreate = (req) => {
        req.send = () => {
          req.respond(401);
        };
      };
      assert.throws(() => {
        request.send(workbook);
      }, UnauthorizedError);
    });
  });
});
