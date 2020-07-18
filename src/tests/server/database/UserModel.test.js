import * as assert from 'assert';
import UserModel from '../../../server/database/UserModel.js';

describe('UserModel', () => {
  describe('#constructor', () => {
    it('Should create user', () => {
      const user = new UserModel('login', 'password', 0);
      assert.strictEqual(user.login, 'login');
      assert.strictEqual(user.password, 'password');
      assert.strictEqual(user.isAdmin, 0);
    });
    it('Should throw error because of empty password', () => {
      assert.throws(() => {
        new UserModel('login', '', 0);
      });
    });
    it('Should throw error because of empty login', () => {
      assert.throws(() => {
        new UserModel('', 'password', 1);
      });
    });
    it('Should throw error because of invalid isAdmin', () => {
      assert.throws(() => {
        new UserModel('login', '', 2);
      });
    });
  });
  describe('#set voids', () => {
    it('Should set password', () => {
      const user = new UserModel('login', 'password', 0);
      user.setPassword('password1');
      assert.strictEqual(user.password, 'password1');
    });
    it('Should throw error because of empty password', () => {
      assert.throws(() => {
        const user = new UserModel('login', 'password', 0);
        user.setPassword('');
      });
    });
    it('Should set isAdmin', () => {
      const user = new UserModel('login', 'password', 0);
      user.setIsAdmin(1);
      assert.strictEqual(user.isAdmin, 1);
    });
    it('Should throw error because of invalid isAdmin', () => {
      assert.throws(() => {
        const user = new UserModel('login', 'password', 0);
        user.setIsAdmin(2);
      });
    });
  });
  describe('#fromSQLtoUsers', () => {
    it('Should transform sql answer to array of users', () => {
      const rows = [
        {
          login: 'login',
          password: 'password',
          isAdmin: 0,
        },
        {
          login: 'log',
          password: 'qwerty',
          isAdmin: 0,
        },
      ];
      assert.deepStrictEqual(
        UserModel.fromSQLtoUsers(rows),
        [new UserModel('login', 'password', 0),
          new UserModel('log', 'qwerty', 0)],
      );
    });
  });
});
