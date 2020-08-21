import * as assert from 'assert';
import express from 'express';
import request from 'supertest';
import TestEnvironment from '../database/TestEnvironment.js';
import UserModel from '../../../server/database/UserModel.js';
import UserHandler from '../../../server/handlers/UserHandler.js';

describe('UserHandler', () => {
  let environment;
  let userHandler;
  let app;

  beforeEach(() => {
    environment = TestEnvironment.getInstance();
    userHandler = new UserHandler(environment.dataRepo, {});
    environment.init();
    app = express();
    app.use(express.json());
  });
  afterEach(() => {
    TestEnvironment.destroyInstance();
  });
  describe('#post', () => {
    it('should give response 200 and user data', () => {
      app.post('/user/post', (req, res) => {
        userHandler.post(req, res);
      });
      return request(app)
        .post('/user/post')
        .send({
          username: 'login',
          password: '1234567',
        })
        .expect(200)
        .then((response) => {
          assert.deepStrictEqual(response.body.username, 'login');
          assert.deepStrictEqual(response.body.isAdmin, false);
        })
        .then(() => {
          assert.notDeepStrictEqual(environment.dataRepo.userRepo.get('login'), undefined);
        });
    });
    it('should give response 403 because of reserved login', () => {
      const user = new UserModel('login', '1234567', false);
      environment.dataRepo.userRepo.save(user);
      app.post('/user/post', (req, res) => {
        userHandler.post(req, res);
      });
      return request(app)
        .post('/user/post')
        .send({
          username: 'login',
          password: '12345678',
        })
        .expect(409);
    });
    it('should give response 400 because of incorrect password', () => {
      app.post('/user/post', (req, res) => {
        userHandler.post(req, res);
      });
      return request(app)
        .post('/user/post')
        .send({
          username: 'login',
          password: '123',
        })
        .expect(400);
    });
    it('should give response 400 because of invalid data', () => {
      app.post('/user/post', (req, res) => {
        userHandler.post(req, res);
      });
      return request(app)
        .post('/user/post')
        .expect(400);
    });
  });
});
