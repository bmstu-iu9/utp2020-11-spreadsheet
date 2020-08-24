import * as assert from 'assert';
import UserModel from '../../../server/database/UserModel.js';
import FormatError from '../../../lib/errors/FormatError.js';

describe('UserModel', () => {
  describe('#constructor()', () => {
    it('should create user', () => {
      const user = new UserModel('login', false, 'password');
      assert.strictEqual(user.login, 'login');
      assert.strictEqual(user.password, UserModel.getHashedPassword('password'));
      assert.strictEqual(user.isAdmin, 0);
    });
    it('should throw error because of empty password', () => {
      assert.throws(() => {
        new UserModel('login', false, '');
      }, FormatError);
    });
    it('should throw error because of empty login', () => {
      assert.throws(() => {
        new UserModel('', true, 'password');
      }, FormatError);
    });
    it('should throw error because of invalid isAdmin', () => {
      assert.throws(() => {
        new UserModel('login', 2, 'password');
      }, TypeError);
    });
  });
  describe('#setPassword() && #getHashedPassword()', () => {
    it('should set password', () => {
      const user = new UserModel('login', false, 'password');
      user.setPassword('password1');
      assert.strictEqual(user.password, UserModel.getHashedPassword('password1'));
    });
    it('should throw error because of empty password', () => {
      assert.throws(() => {
        const user = new UserModel('login', false, 'password');
        user.setPassword('');
      }, FormatError);
    });
  });
  describe('#setIsAdmin()', () => {
    it('should set isAdmin', () => {
      const user = new UserModel('login', false, 'password');
      user.setIsAdmin(true);
      assert.strictEqual(user.isAdmin, 1);
    });
    it('should throw error because of invalid isAdmin', () => {
      assert.throws(() => {
        const user = new UserModel('login', false, 'password');
        user.setIsAdmin(2);
      }, TypeError);
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
        new UserModel('login', false, 'password'),
      );
    });
  });
  describe('#fromJSONtoUsers()', () => {
    it('should transform json answer to array of users', () => {
      const user1 = new UserModel('login1', true);
      const user2 = new UserModel('login2', false);
      const answer = [{
        username: user1.login,
        isAdmin: user1.getIsAdmin(),
      },
      {
        username: user2.login,
        isAdmin: user2.getIsAdmin(),
      }];
      assert.deepStrictEqual(UserModel.fromJSONtoUsers(answer), [user1, user2]);
    });
  });
});
