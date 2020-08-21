import * as assert from 'assert';
import express from 'express';
import request from 'supertest';
import TestEnvironment from '../database/TestEnvironment.js';
import AuthHandler from '../../../server/handlers/AuthHandler.js';
import UserModel from '../../../server/database/UserModel.js';
import UuidValidator from '../../../lib/uuid/UuidValidator.js';

describe('AuthHandler', () => {
  let environment;
  let authHandler;
  let app;

  beforeEach(() => {
    environment = TestEnvironment.getInstance();
    authHandler = new AuthHandler(environment.dataRepo, {});
    environment.init();
    app = express();
    app.use(express.json());
  });
  afterEach(() => {
    TestEnvironment.destroyInstance();
  });
  describe('#post', () => {
    it('should give response 200 and token', () => {
      const user = new UserModel('login', '1234567', false);
      environment.dataRepo.userRepo.save(user);
      app.post('/auth/test', (req, res) => {
        authHandler.post(req, res);
      });
      return request(app)
        .post('/auth/test')
        .send({
          username: user.login,
          password: '1234567',
        })
        .expect(200)
        .then((response) => {
          assert.deepStrictEqual(UuidValidator.isUuidValid(response.body.token), true);
        });
    });
    it('should give response 403 because of incorrect login', () => {
      app.post('/auth/test', (req, res) => {
        authHandler.post(req, res);
      });
      return request(app)
        .post('/auth/test')
        .send({
          username: 'login',
          password: '1234567',
        })
        .expect(403);
    });
    it('should give response 403 because of incorrect password', () => {
      const user = new UserModel('login', '1234567', false);
      environment.dataRepo.userRepo.save(user);
      app.post('/auth/test', (req, res) => {
        authHandler.post(req, res);
      });
      return request(app)
        .post('/auth/test')
        .send({
          username: user.login,
          password: '7654321',
        })
        .expect(403);
    });
    it('should give response 403 because of incorrect request', () => {
      app.post('/auth/test', (req, res) => {
        authHandler.post(req, res);
      });
      return request(app)
        .post('/auth/test')
        .expect(403);
    });
  });
});
