import crypto from 'crypto';
import FormatError from '../../errors/FormatError.js';

export default class UserModel {
  constructor(login, password, isAdmin) {
    if (UserModel.isLoginCorrect(login)) {
      this.login = login;
      this.setPassword(password);
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
    if (password.length > 0) {
      this.password = UserModel.getHashedPassword(password);
    } else {
      throw new FormatError('UserModel: wrong format of password');
    }
  }

  static getHashedPassword(password) {
    return crypto.createHash('sha256').update(password).digest('base64');
  }

  static fromSQLtoUser(row) {
    const user = new UserModel(row.login, 'password', Boolean(row.isAdmin));
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
}
