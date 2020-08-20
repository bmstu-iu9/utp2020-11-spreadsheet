import * as assert from 'assert';
import sinon from 'sinon';
import XhrAuthorizer from '../../../client/js/requests/XhrAuthorizer.js';

describe('XhrAuthorizer', () => {
  const token = 'eab90c8c-1b47-42f9-8109-868b558353b0';

  beforeEach(() => {
    global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
  });
  afterEach(() => {
    global.XMLHttpRequest.restore();
  });

  describe('#constructor()', () => {
    it('should create object with correct fields', () => {
      const authorizer = new XhrAuthorizer(token);
      assert.strictEqual(authorizer.token, token);
    });
    it('should throw an exception for non-UUID', () => {
      assert.throws(() => {
        new XhrAuthorizer('111');
      }, TypeError);
    });
  });
  describe('#authorize()', () => {
    it(`should add Authorization: Token ${token}`, () => {
      const request = new XMLHttpRequest();
      const expectedName = 'Authorization';
      const expectedValue = `Token ${token}`;
      let called = false;
      sinon.stub(request, 'setRequestHeader').callsFake((name, value) => {
        assert.strictEqual(name, expectedName);
        assert.strictEqual(value, expectedValue);
        called = true;
      });
      const authorizer = new XhrAuthorizer(token);
      authorizer.authorize(request);
      assert.strictEqual(called, true);
    });
  });
});
