export default class WorkbookModel {
  constructor(path, login = null, id) {
    if (path.length > 0) {
      this.id = id === undefined ? null : id;
      this.path = path;
      this.login = login;
    } else {
      throw Error('Error while creating book: wrong format of data');
    }
  }

  setLogin(login) {
    this.login = login;
  }

  setPath(path) {
    this.path = path;
  }
}
