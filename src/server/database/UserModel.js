export default class UserModel {
  constructor(login, password, isAdmin) {
    if (UserModel.isLoginCorrect(login)) {
      this.login = login;
      this.setPassword(password);
      this.setIsAdmin(isAdmin);
    } else {
      throw Error('UserModel: wrong format of data');
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
      this.password = password;
    } else {
      throw Error('UserModel: wrong format of data');
    }
  }

  static fromSQLtoUsers(rows) {
    const result = [];
    rows.forEach((row) => {
      const user = new UserModel(row.login, row.password, Boolean(row.isAdmin));
      result.push(user);
    });
    return result;
  }
}
