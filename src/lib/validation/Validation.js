import Database from 'better-sqlite3';
import UserRepo from '../../server/database/UserRepo.js';
import UserModel from '../../server/database/UserModel.js';

export default class Validation {
  static validate(login, password, isRegistration, pathToDatabase) {
    const database = new Database(pathToDatabase);
    let result = '';
    if (isRegistration === true) {
      result = this.validateRegistration(login, password, database);
    } else {
      result = this.validateAuthorization(login, password, database);
    }
    database.close();
    return result;
  }

  static validateRegistration(login, password, database) {
    const repo = new UserRepo(database);
    const checkUser = repo.get(login);
    let result = '';
    if (login.length === 0) {
      result = 'Short login';
    } else if (this.emptyString(login)) {
      result = 'Empty login';
    } else if (typeof checkUser !== 'undefined') {
      result = 'Need to change login';
    } else if (password.length === 0) {
      result = 'Short password';
    } else if (this.emptyString(password)) {
      result = 'Empty password';
    } else {
      result = 'OK';
    }
    return result;
  }

  static validateAuthorization(login, password, database) {
    const repo = new UserRepo(database);
    const checkUser = repo.get(login);
    let result = '';
    if (typeof checkUser === 'undefined') {
      result = 'Nonexistent user';
    } else if (!this.checkLogin(login, checkUser.login)) {
      result = 'Incorrect login';
    } else if (!this.checkPassword(UserModel.getHashedPassword(password), checkUser.password)) {
      result = 'Incorrect password';
    } else {
      result = 'OK';
    }
    return result;
  }

  static emptyString(str) {
    return str.replace(/\s/g, '').length === 0;
  }

  static checkLogin(login, databaseLogin) {
    return login === databaseLogin;
  }

  static checkPassword(password, databasePassword) {
    return password === databasePassword;
  }
}
