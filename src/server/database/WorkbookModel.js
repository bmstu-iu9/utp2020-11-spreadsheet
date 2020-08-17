import FormatError from '../../lib/errors/FormatError.js';

export default class WorkbookModel {
  constructor(login = null, id = null) {
    if (WorkbookModel.idIsCorrect(id)) {
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

  static fromSQLtoBooks(rows) {
    const result = [];
    rows.forEach((row) => {
      result.push(new WorkbookModel(row.login, row.id));
    });
    return result;
  }
}
