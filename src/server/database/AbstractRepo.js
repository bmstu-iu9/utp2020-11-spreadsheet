import ImplementationError from '../../lib/errors/ImplementationError.js';

export default class AbstractRepo {
  constructor(database) {
    this.database = database;
  }

  doesTableExist() {
    const tableName = this.constructor.getTableName();
    const info = this.database.prepare('SELECT name FROM sqlite_master WHERE type=\'table\' AND name=?').all(tableName);
    return info.length === 1;
  }

  static getTableName() {
    throw new ImplementationError();
  }
}
