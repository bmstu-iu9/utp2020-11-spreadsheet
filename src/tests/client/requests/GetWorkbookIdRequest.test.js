import sinon from 'sinon';
import * as assert from 'assert';
import Request from '../../../client/js/requests/Request.js';
import RequestAuthorizer from '../../../client/js/requests/RequestAuthorizer.js';
import WorkbookIdSerializer from '../../../lib/serialization/WorkbookIdSerializer.js';
import GetWorkbookIdRequest from '../../../client/js/requests/GetWorkbookIdRequest.js';
import Workbook from '../../../lib/spreadsheets/Workbook.js';
import WorkbookId from '../../../lib/spreadsheets/WorkbookId.js';
import UnknownServerError from '../../../lib/errors/UnknownServerError.js';

describe('GetWorkbookIdRequest', () => {
  const baseUrl = 'localhost';
  const authorizer = new RequestAuthorizer('a3b7755b-931b-4913-8c68-ddbb2e61e320');
  const request = new GetWorkbookIdRequest(baseUrl, authorizer);

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
    it('should return workbookId', () => {
      const workbook = new Workbook('name');
      const id = 1;
      const uuid = '2c8c1483-377f-4f5f-a0e9-5a846f19e8c6';
      const expected = new WorkbookId(workbook, id, uuid);
      let called = false;
      global.XMLHttpRequest.onCreate = (req) => {
        const spy = sinon.spy(req, 'open');
        req.send = () => {
          spy.calledOnceWith('GET', `${baseUrl}/workbook/${id}`);
          const data = JSON.stringify(WorkbookIdSerializer.serialize(expected));
          req.respond(200, { 'Content-Type': 'application/json' }, data);
          called = true;
        };
      };
      const workbookId = request.send(id);
      assert.strictEqual(called, true);
      assert.deepStrictEqual(workbookId, expected);
    });
    it('should throw UnknownServerError', () => {
      global.XMLHttpRequest.onCreate = (req) => {
        req.send = () => {
          req.respond(500);
        };
      };
      assert.throws(() => {
        request.send();
      }, UnknownServerError);
    });
    it('should return commits', () => {
      const commits = [
        {
          ID: '4f6a134b-4305-4ec3-9f98-4396f0f3f92c',
        },
      ];
      const after = '28ca1eb4-bc64-4418-b866-d370e5656094';
      global.XMLHttpRequest.onCreate = (req) => {
        const spy = sinon.spy(req, 'open');
        req.send = () => {
          assert.strictEqual(spy.calledOnceWith('GET', `${baseUrl}/workbook/1?after=${after}`), true);
          req.respond(200,
            { 'Content-Type': 'application/json' },
            JSON.stringify(commits));
        };
      };
      const actual = request.send(1, after);
      assert.deepStrictEqual(actual, commits);
    });
  });
});
