import Database from 'better-sqlite3';
import NotImplementedError from '../../lib/errors/NotImplementedError.js';

export default class AbstractRepo {
  constructor(database) {
    this.setDatabase(database);
  }

  setDatabase(database) {
    if (!(database instanceof Database)) {
      throw new TypeError();
    }
    this.database = database;
  }

  doesTableExist() {
    const tableName = this.constructor.getTableName();
    const info = this.database.prepare('SELECT name FROM sqlite_master WHERE type=\'table\' AND name=?').all(tableName);
    return info.length === 1;
  }

  static getTableName() {
    throw new NotImplementedError(this);
  }
}
