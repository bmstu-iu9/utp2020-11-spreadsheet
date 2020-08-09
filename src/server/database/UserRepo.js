import UserModel from './UserModel.js';
import DatabaseError from '../../lib/errors/DatabaseError.js';
import AbstractRepo from './AbstractRepo.js';

export default class UserRepo extends AbstractRepo {
  static getTableName() {
    return 'Users';
  }

  dropTable() {
    try {
      this.database.prepare(`DROP TABLE IF EXISTS ${UserRepo.getTableName()}`).run();
    } catch (err) {
      throw new DatabaseError(`Error while dropping user table: ${err}`);
    }
  }

  createTable() {
    const userTableSchema = `CREATE TABLE IF NOT EXISTS ${UserRepo.getTableName()}
                             (
                                 login    TEXT    NOT NULL PRIMARY KEY,
                                 password BLOB    NOT NULL,
                                 isAdmin  INTEGER NOT NULL DEFAULT 0
                             );
    `;
    try {
      this.database.prepare(userTableSchema).run();
    } catch (err) {
      throw new DatabaseError(`Error while creating user table: ${err}`);
    }
  }

  save(user) {
    try {
      this.database.prepare(`INSERT INTO ${UserRepo.getTableName()} (login, password, isAdmin)
                             VALUES (?, ?, ?)
                             ON CONFLICT(login) DO UPDATE SET password = ?,
                                                              isAdmin  = ?;`)
        .run(user.login, user.password, user.isAdmin, user.password, user.isAdmin);
    } catch (err) {
      throw new DatabaseError(`Error while inserting or updating user: ${err}`);
    }
  }

  get(login) {
    try {
      const row = this.database.prepare(`SELECT login, password, isAdmin
                              FROM ${UserRepo.getTableName()}
                              WHERE login = ?`).get(login);
      return row ? UserModel.fromSQLtoUser(row) : undefined;
    } catch (e) {
      throw new DatabaseError(`Error while get user: ${e}`);
    }
  }

  getAllUsers() {
    try {
      const rows = this.database.prepare(`SELECT login, password, isAdmin
                                          FROM ${UserRepo.getTableName()}`).all();
      return UserModel.fromSQLtoUsers(rows);
    } catch (e) {
      throw new DatabaseError(`Error while get users: ${e}`);
    }
  }

  delete(login) {
    try {
      this.database.prepare(`DELETE
                             FROM ${UserRepo.getTableName()}
                             WHERE login = ?`)
        .run(login);
    } catch (err) {
      throw new DatabaseError(`Error while deleting user: ${err}`);
    }
  }

  deleteAll() {
    try {
      this.database.prepare(`DELETE
                             FROM ${UserRepo.getTableName()}`)
        .run();
    } catch (err) {
      throw new DatabaseError(`Error while deleting users: ${err}`);
    }
  }
}
