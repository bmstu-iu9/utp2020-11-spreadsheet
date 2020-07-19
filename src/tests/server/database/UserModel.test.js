import * as assert from 'assert';
import UserModel from '../../../server/database/UserModel.js';

describe('UserModel', () => {
  describe('#constructor', () => {
    it('Should create user', () => {
      const user = new UserModel('login', 'password', false);
      assert.strictEqual(user.login, 'login');
      assert.strictEqual(user.password, UserModel.getHashedPassword('password'));
      assert.strictEqual(user.isAdmin, 0);
    });
    it('Should throw error because of empty password', () => {
      assert.throws(() => {
        new UserModel('login', '', false);
      });
    });
    it('Should throw error because of empty login', () => {
      assert.throws(() => {
        new UserModel('', 'password', true);
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
      const user = new UserModel('login', 'password', false);
      user.setPassword('password1');
      assert.strictEqual(user.password, UserModel.getHashedPassword('password1'));
    });
    it('Should throw error because of empty password', () => {
      assert.throws(() => {
        const user = new UserModel('login', 'password', false);
        user.setPassword('');
      });
    });
    it('Should set isAdmin', () => {
      const user = new UserModel('login', 'password', false);
      user.setIsAdmin(true);
      assert.strictEqual(user.isAdmin, 1);
    });
    it('Should throw error because of invalid isAdmin', () => {
      assert.throws(() => {
        const user = new UserModel('login', 'password', false);
        user.setIsAdmin(2);
      });
    });
  });
  describe('#fromSQLtoUser', () => {
    it('Should transform sql answer to user', () => {
      const row = {
        login: 'login',
        password: UserModel.getHashedPassword('password'),
        isAdmin: false,
      };
      assert.deepStrictEqual(
        UserModel.fromSQLtoUser(row),
        new UserModel('login', 'password', false),
      );
    });
  });
});
