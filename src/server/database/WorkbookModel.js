export default class WorkbookModel {
  constructor(path, login = null, id = null) {
    if (path.length > 0) {
      this.path = path;
      this.id = id;
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

  static fromSQLtoBooks(rows) {
    const result = [];
    rows.forEach((row) => {
      result.push(new WorkbookModel(row.path, row.login, row.id));
    });
    return result;
  }
}
