export default class UserModel {
  constructor(login, password, isAdmin) {
    if (login.length > 0 && password.length > 0 && (isAdmin === 1 || isAdmin === 0)) {
      this.login = login;
      this.password = password;
      this.isAdmin = isAdmin;
    } else {
      throw Error('Error while creating user: wrong format of data');
    }
  }

  setIsAdmin(isAdmin) {
    if (isAdmin === 1 || isAdmin === 0) {
      this.isAdmin = isAdmin;
    } else {
      throw Error('Error while creating user: wrong format of data');
    }
  }

  setPassword(password) {
    if (password.length > 0) {
      this.password = password;
    } else {
      throw Error('Error while creating user: wrong format of data');
    }
  }
}
