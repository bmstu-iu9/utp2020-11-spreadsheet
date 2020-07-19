import Database from 'better-sqlite3';
import UserRepo from '../../server/database/UserRepo.js';
import UserModel from '../../server/database/UserModel.js';

export default class Validation {
  constructor(pathToDatabase) {
    this.setNewDatabase(pathToDatabase);
  }

  setNewDatabase(pathToDatabase) {
    this.database = new Database(pathToDatabase);
  }

  // Main method
  validate(login, password, isRegistration) {
    if (this.database.open === false) {
      throw Error('Closed database');
    }
    let result = '';
    if (isRegistration === true) {
      result = this.validateRegistration(login, password);
    } else {
      result = this.validateAuthorization(login, password);
    }
    return result;
  }

  validateRegistration(login, password) {
    const repo = new UserRepo(this.database);
    const checkUser = repo.get(login);
    let result = '';
    if (Validation.haveWhitespaces(login)) {
      result = 'Whitespaces in login';
    } else if (login.length === 0) {
      result = 'Empty login';
    } else if (typeof checkUser !== 'undefined') {
      result = 'Need to change login';
    } else if (Validation.haveWhitespaces(password)) {
      result = 'Whitespaces in password';
    } else if (password.length === 0) {
      result = 'Empty password';
    } else {
      result = 'OK';
    }
    return result;
  }

  validateAuthorization(login, password) {
    const repo = new UserRepo(this.database);
    const checkUser = repo.get(login);
    let result = '';
    if (typeof checkUser === 'undefined') {
      result = 'Nonexistent user';
    } else if (!Validation.checkPassword(UserModel.getHashedPassword(password), checkUser.password)) {
      result = 'Incorrect password';
    } else {
      result = 'OK';
    }
    return result;
  }

  close() {
    this.database.close();
  }

  static haveWhitespaces(str) {
    return str.length !== str.replace(/\s/g, '').length;
  }

  static checkLogin(login, databaseLogin) {
    return login === databaseLogin;
  }

  static checkPassword(password, databasePassword) {
    return password === databasePassword;
  }
}
