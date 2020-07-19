import Database from 'better-sqlite3';
import UserRepo from '../../server/database/UserRepo.js';
import UserModel from '../../server/database/UserModel.js';

export default class Validation {
  static validate(login, password, isRegistration, pathToDatabase) {
    const database = new Database(pathToDatabase);
    if (isRegistration === true) {
      const result = this.validateRegistration(login, password, database);
      database.close();
      return result;
    } else {
      const result = this.validateAuthorization(login, password, database);
      database.close();
      return result;
    }
  }

  static validateRegistration(login, password, database) {
    const repo = new UserRepo(database);
    const checkUser = repo.get(login);
    if (login.length === 0) {
      return 'Short login';
    } else if (emptyString(login)) {
      return 'Empty login';
    } else if (typeof checkUser !== 'undefined') {
      return 'Need to change login';
    } else if (password.length === 0) {
      return 'Short password';
    } else if (emptyString(password)) {
      return 'Empty password';
    } else {
      return 'OK';
    }
  }

  static validateAuthorization(login, password, database) {
    const repo = new UserRepo(database);
    const checkUser = repo.get(login);
    if (typeof checkUser === 'undefined') {
      return 'Nonexistent user';
    } else if (!checkLogin(login, checkUser.login)) {
      return 'Incorrect login';
    } else if (!checkPassword(UserModel.getHashedPassword(password), checkUser.password)) {
      return 'Incorrect password';
    } else {
      return 'OK';
    }
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
