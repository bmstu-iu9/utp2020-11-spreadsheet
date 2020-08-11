import * as assert from 'assert';
import express from 'express';
import request from 'supertest';
import TestEnvironment from '../database/TestEnvironment.js';
import EndpointHandler from '../../../server/handlers/EndpointHandler.js';

describe('EndpointHandler', () => {
  let environment;

  beforeEach(() => {
    environment = TestEnvironment.getInstance();
  });

  afterEach(() => {
    TestEnvironment.destroyInstance();
  });

  describe('#constructor()', () => {
    it('should create an object with correct properties', () => {
      const handler = new EndpointHandler(environment.dataRepo);
      assert.strictEqual(handler.dataRepo, environment.dataRepo);
    });
    it('should throw an exception for non-DataRepo', () => {
      assert.throws(() => {
        new EndpointHandler({});
      }, TypeError);
    });
  });

  describe('not implemented methods', () => {
    const testCases = [
      {
        name: 'get()',
        method: (handler, req, res) => handler.get(req, res),
      },
      {
        name: 'post()',
        method: (handler, req, res) => handler.post(req, res),
      },
      {
        name: 'patch()',
        method: (handler, req, res) => handler.patch(req, res),
      },
      {
        name: 'delete()',
        method: (handler, req, res) => handler.delete(req, res),
      },
    ];

    testCases.forEach((testCase) => {
      it(`${testCase.name} should return 405`, (done) => {
        const handler = new EndpointHandler(environment.dataRepo);
        const app = express();
        app.get('/', (req, res) => testCase.method(handler, req, res));
        request(app).get('/').expect(405, done);
      });
    });
  });
});
