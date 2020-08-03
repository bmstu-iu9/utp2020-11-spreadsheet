import * as assert from 'assert';
import UserModel from '../../../server/database/UserModel.js';

describe('UserModel', () => {
  describe('#constructor()', () => {
    it('should create user', () => {
      const user = new UserModel('login', 'password', false);
      assert.strictEqual(user.login, 'login');
      assert.strictEqual(user.password, UserModel.getHashedPassword('password'));
      assert.strictEqual(user.isAdmin, 0);
    });
    it('should throw error because of empty password', () => {
      assert.throws(() => {
        new UserModel('login', '', false);
      }, (err) => {
        assert.strictEqual(err.name, 'FormatError');
        return true;
      });
    });
    it('should throw error because of empty login', () => {
      assert.throws(() => {
        new UserModel('', 'password', true);
      }, (err) => {
        assert.strictEqual(err.name, 'FormatError');
        return true;
      });
    });
    it('should throw error because of invalid isAdmin', () => {
      assert.throws(() => {
        new UserModel('login', 'password', 2);
      }, (err) => {
        assert.strictEqual(err.name, 'TypeError');
        return true;
      });
    });
  });
  describe('#setPassword() && #getHashedPassword()', () => {
    it('should set password', () => {
      const user = new UserModel('login', 'password', false);
      user.setPassword('password1');
      assert.strictEqual(user.password, UserModel.getHashedPassword('password1'));
    });
    it('should throw error because of empty password', () => {
      assert.throws(() => {
        const user = new UserModel('login', 'password', false);
        user.setPassword('');
      }, (err) => {
        assert.strictEqual(err.name, 'FormatError');
        return true;
      });
    });
  });
  describe('#setIsAdmin()', () => {
    it('should set isAdmin', () => {
      const user = new UserModel('login', 'password', false);
      user.setIsAdmin(true);
      assert.strictEqual(user.isAdmin, 1);
    });
    it('should throw error because of invalid isAdmin', () => {
      assert.throws(() => {
        const user = new UserModel('login', 'password', false);
        user.setIsAdmin(2);
      }, (err) => {
        assert.strictEqual(err.name, 'TypeError');
        return true;
      });
    });
  });
  describe('#fromSQLtoUser()', () => {
    it('should transform sql answer to user', () => {
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
