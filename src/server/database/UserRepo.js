import UserModel from './UserModel.js';

export default class UserRepo {
  constructor(dao) {
    this.dao = dao;
  }

  createTable() {
    const userTableSchema = `CREATE TABLE IF NOT EXISTS Users
                             (
                                 login    TEXT    NOT NULL PRIMARY KEY,
                                 password BLOB    NOT NULL,
                                 isAdmin  INTEGER NOT NULL DEFAULT 0
                             );
    `;
    return this.dao.run(userTableSchema, (err) => {
      if (err) {
        throw Error(`Error while creating user table: ${err}`);
      }
    });
  }

  save(user) {
    return this.dao.run(`INSERT INTO Users (login, password, isAdmin)
                         VALUES (?, ?, ?)
                         ON CONFLICT(login) DO UPDATE SET password = ?,
                                                          isAdmin  = ?;`,
    [user.login, user.password, user.isAdmin, user.password, user.isAdmin], (err) => {
      if (err) {
        throw Error(`Error while inserting or updating user: ${err}`);
      }
    });
  }

  get(login) {
    return this.dao.get(`SELECT login, password, isAdmin
                         FROM Users
                         WHERE login = ?`, [login], (err, row) => {
      if (err) {
        throw Error(`Error while get user: ${err}`);
      }
      if (row) {
        return new UserModel(row.login, row.password, row.isAdmin);
      }
      throw Error(`Error while get user: no user with login ${login} `);
    });
  }

  getAllUsers() {
    return this.dao.all(`SELECT login, password, isAdmin
                         FROM Users `, (err, rows) => {
      if (err) {
        throw Error(`Error while get users: ${err}`);
      }
      const result = [];
      rows.forEach((row) => {
        const user = new UserModel(row.login, row.password, row.isAdmin);
        result.push(user);
      });
      return result;
    });
  }

  delete(user) {
    return this.dao.run(`DELETE
                         FROM Users
                         WHERE login = ?`, [user.login], (err) => {
      if (err) {
        throw Error(`Error while deleting user: ${err}`);
      }
    });
  }
}
