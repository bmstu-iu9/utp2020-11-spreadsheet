import UserModel from '../database/UserModel.js';
import DataRepo from '../database/DataRepo.js';

export const result = Object.freeze({
  whitespacesInLogin: Symbol('Whitespaces in login'),
  emptyLogin: Symbol('Empty login'),
  loginUnavailable: Symbol('Login unavailable'),
  whitespacesInPassword: Symbol('Whitespaces in password'),
  shortPassword: Symbol('Short password'),
  nonExistentUser: Symbol('Nonexistent user'),
  incorrectPassword: Symbol('Incorrect password'),
  ok: Symbol('OK'),
});

export class Validation {
  constructor(dataRepo) {
    this.setDataRepo(dataRepo);
  }

  setDataRepo(dataRepo) {
    if (!(dataRepo instanceof DataRepo)) {
      throw new TypeError('dataRepo must be a DataRepo instance');
    }
    this.dataRepo = dataRepo;
  }

  validate(login, password, isRegistration) {
    if (isRegistration === true) {
      return this.validateRegistration(login, password);
    }
    return this.validateAuthorization(login, password);
  }

  validateRegistration(login, password) {
    const { userRepo } = this.dataRepo;
    const checkUser = userRepo.get(login);
    if (Validation.haveWhitespaces(login)) {
      return result.whitespacesInLogin;
    }
    if (login.length === 0) {
      return result.emptyLogin;
    }
    if (checkUser !== undefined) {
      return result.loginUnavailable;
    }
    if (Validation.haveWhitespaces(password)) {
      return result.whitespacesInPassword;
    }
    if (password.length < 6) {
      return result.shortPassword;
    }
    return result.ok;
  }

  validateAuthorization(login, password) {
    const { userRepo } = this.dataRepo;
    const checkUser = userRepo.get(login);
    if (checkUser === undefined) {
      return result.nonExistentUser;
    }
    if (!Validation.checkPassword(
      UserModel.getHashedPassword(password),
      checkUser.password,
    )) {
      return result.incorrectPassword;
    }
    return result.ok;
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
