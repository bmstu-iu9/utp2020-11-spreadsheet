import WorkbookModel from './WorkbookModel.js';
import DatabaseError from '../../lib/errors/DatabaseError.js';
import AbstractRepo from './AbstractRepo.js';

export default class WorkbookRepo extends AbstractRepo {
  static getTableName() {
    return 'Books';
  }

  dropTable() {
    try {
      this.database.prepare(`DROP TABLE IF EXISTS ${WorkbookRepo.getTableName()}`).run();
    } catch (err) {
      throw new DatabaseError(`Error while dropping user table: ${err}`);
    }
  }

  createTable() {
    const workbookTableSchema = `CREATE TABLE IF NOT EXISTS ${WorkbookRepo.getTableName()}
                                 (
                                     id    INTEGER PRIMARY KEY,
                                     login TEXT,
                                     FOREIGN KEY (login) REFERENCES Users (login)
                                         ON DELETE CASCADE
                                 )`;
    try {
      this.database.prepare(workbookTableSchema).run();
    } catch (err) {
      throw new DatabaseError(`Error while creating user table: ${err}`);
    }
  }

  getById(id) {
    try {
      const row = this.database.prepare(`SELECT id, login
                                         FROM ${WorkbookRepo.getTableName()}
                                         WHERE id = ?`).get(id);
      if (row) {
        return new WorkbookModel(row.login, row.id);
      }
      throw new DatabaseError(`no book with id ${id}`);
    } catch (err) {
      throw new DatabaseError(`Error while get workbook: ${err}`);
    }
  }

  getByLogin(login) {
    try {
      const rows = this.database.prepare(`SELECT id, login
                                          FROM ${WorkbookRepo.getTableName()}
                                          WHERE login = ?`)
        .all(login);
      if (rows.length > 0) {
        return WorkbookModel.fromSQLtoBooks(rows);
      }
      throw new DatabaseError(`no books with login ${login}`);
    } catch (err) {
      throw new DatabaseError(`Error while get workbooks: ${err}`);
    }
  }

  getAllBooks() {
    try {
      const rows = this.database.prepare(`SELECT *
                         FROM ${WorkbookRepo.getTableName()}`)
        .all();
      return WorkbookModel.fromSQLtoBooks(rows);
    } catch (err) {
      throw new DatabaseError(`Error while get workbooks: ${err}`);
    }
  }

  save(book) {
    if (book.id == null) {
      try {
        const info = this.database.prepare(`INSERT INTO ${WorkbookRepo.getTableName()} (login)
                           VALUES (?)`)
          .run(book.login);
        return info.lastInsertRowid;
      } catch (e) {
        throw new DatabaseError(`Error while inserting book: ${e}`);
      }
    } else {
      try {
        this.database.prepare(`UPDATE ${WorkbookRepo.getTableName()}
                         SET login = ? WHERE id = ?`)
          .run(book.login, book.id);
        return book.id;
      } catch (e) {
        throw new DatabaseError(`Error while updating book: ${e}`);
      }
    }
  }

  delete(id) {
    try {
      this.database.prepare(`DELETE
                             FROM ${WorkbookRepo.getTableName()}
                             WHERE id = ?`)
        .run(id);
    } catch (err) {
      throw new DatabaseError(`Error while deleting book: ${err}`);
    }
  }

  deleteAll() {
    try {
      this.database.prepare(`DELETE
                             FROM ${WorkbookRepo.getTableName()}`)
        .run();
    } catch (e) {
      throw new DatabaseError(`Error while deleting books: ${e}`);
    }
  }
}
