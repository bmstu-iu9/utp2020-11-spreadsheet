import sinon from 'sinon';
import * as assert from 'assert';
import Workbook from '../../../lib/spreadsheets/Workbook.js';
import GetWorkbookRequest from '../../../client/js/requests/GetWorkbookRequest.js';
import Request from '../../../client/js/requests/Request.js';
import RequestAuthorizer from '../../../client/js/requests/RequestAuthorizer.js';
import WorkbookIdSerializer from '../../../lib/serialization/WorkbookIdSerializer.js';
import WorkbookId from '../../../lib/spreadsheets/WorkbookId.js';

describe('GetWorkbookRequest', () => {
  before(() => {
    global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
  });
  after(() => {
    global.XMLHttpRequest.restore();
  });

  const baseUrl = 'https://example.com';
  const authorizer = new RequestAuthorizer('f546a652-e0cf-4718-b77d-9dec4a9b4e5c');
  const request = new GetWorkbookRequest(baseUrl, authorizer);

  it('should be a child of Request', () => {
    assert.strictEqual(request instanceof Request, true);
  });
  describe('#send()', () => {
    it('should return workbook array', () => {
      const workbook = new Workbook('test');
      const id = 1;
      const lastCommitId = '2c8c1483-377f-4f5f-a0e9-5a846f19e8c6';
      const workbookId = new WorkbookId(workbook, id, lastCommitId);
      const serialized = [WorkbookIdSerializer.serialize(workbookId)];
      global.XMLHttpRequest.onCreate = (req) => {
        req.send = () => {
          req.respond(200, {
            'Content-Type': 'application/json',
          },
          JSON.stringify(serialized));
        };
      };
      const authorizerSpy = sinon.spy(authorizer, 'authorize');
      request.send();
      assert.strictEqual(authorizerSpy.calledOnce, true);
    });
  });
});
