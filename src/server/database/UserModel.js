import crypto from 'crypto';
import FormatError from '../../lib/errors/FormatError.js';

export default class UserModel {
  constructor(login, isAdmin, password) {
    if (UserModel.isLoginCorrect(login)) {
      this.login = login;
      if (password !== undefined) {
        this.setPassword(password);
      }
      this.setIsAdmin(isAdmin);
    } else {
      throw new FormatError('UserModel: wrong format of login');
    }
  }

  static isLoginCorrect(login) {
    return typeof login === 'string' && login.length > 0;
  }

  setIsAdmin(isAdmin) {
    if (typeof isAdmin === 'boolean') {
      this.isAdmin = Number(isAdmin);
    } else {
      throw TypeError('UserModel: impossible type for field admin');
    }
  }

  setPassword(password) {
    const minimumPasswordLength = 6;
    if (password.length >= minimumPasswordLength) {
      this.password = UserModel.getHashedPassword(password);
    } else {
      throw new FormatError('UserModel: wrong format of password');
    }
  }

  static getHashedPassword(password) {
    return crypto.createHash('sha256').update(password).digest('base64');
  }

  getIsAdmin() {
    return Boolean(this.isAdmin);
  }

  static fromSQLtoUser(row) {
    const user = new UserModel(row.login, Boolean(row.isAdmin));
    user.password = row.password;
    return user;
  }

  static fromSQLtoUsers(rows) {
    const result = [];
    rows.forEach((row) => {
      result.push(UserModel.fromSQLtoUser(row));
    });
    return result;
  }

  static fromJSONtoUser(row) {
    return new UserModel(row.username, row.isAdmin);
  }

  static fromJSONtoUsers(rows) {
    const result = [];
    rows.forEach((row) => {
      result.push(UserModel.fromJSONtoUser(row));
    });
    return result;
  }

  static fromUserToJSON(user) {
    return {
      isAdmin: Boolean(user.isAdmin),
      username: user.login,
    };
  }

  static fromUsersToJSON(users) {
    const result = [];
    users.forEach((user) => {
      result.push(UserModel.fromUserToJSON(user));
    });
    return result;
  }
}
