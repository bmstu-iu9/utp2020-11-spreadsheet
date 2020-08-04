import FormatError from '../../lib/errors/FormatError.js';

export default class WorkbookModel {
  constructor(path, login = null, id = null) {
    if (WorkbookModel.idIsCorrect(id)) {
      this.setPath(path);
      this.id = id;
      this.setLogin(login);
    } else {
      throw new FormatError('WorkbookModel: wrong format of id');
    }
  }

  static idIsCorrect(id) {
    return typeof id === 'number' || id == null;
  }

  setLogin(login) {
    if ((typeof login === 'string' && login.length > 0) || login == null) {
      this.login = login;
    } else {
      throw TypeError('WorkbookModel: impossible type for field login');
    }
  }

  setPath(path) {
    const pathRegExp = new RegExp('^(~|\\.?)\\/?((\\d|\\w)+\\/)*(\\d|\\w)+\\.json+$');
    if (pathRegExp.test(path)) {
      this.path = path;
    } else {
      throw new FormatError('WorkbookModel: wrong format of path');
    }
  }

  static fromSQLtoBooks(rows) {
    const result = [];
    rows.forEach((row) => {
      result.push(new WorkbookModel(row.path, row.login, row.id));
    });
    return result;
  }
}
