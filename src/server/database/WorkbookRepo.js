import WorkbookModel from './WorkbookModel.js';
import DatabaseError from '../../Errors/DatabaseError.js';

export default class WorkbookRepo {
  constructor(database) {
    this.database = database;
  }

  dropTable() {
    try {
      this.database.prepare('DROP TABLE IF EXISTS Books').run();
    } catch (err) {
      throw new DatabaseError(`Error while dropping user table: ${err}`);
    }
  }

  createTable() {
    const workbookTableSchema = `CREATE TABLE IF NOT EXISTS Books
                                 (
                                     id    INTEGER PRIMARY KEY,
                                     login TEXT,
                                     path  VARCHAR(30) NOT NULL,
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
      const row = this.database.prepare(`SELECT id, login, path
                                         FROM Books
                                         WHERE id = ?`).get(id);
      if (row) {
        return new WorkbookModel(row.path, row.login, row.id);
      }
      throw new DatabaseError(`no book with id ${id}`);
    } catch (err) {
      throw new DatabaseError(`Error while get workbook: ${err}`);
    }
  }

  getByLogin(login) {
    try {
      const rows = this.database.prepare(`SELECT id, login, path
                                          FROM Books
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
                         FROM Books`)
        .all();
      return WorkbookModel.fromSQLtoBooks(rows);
    } catch (err) {
      throw new DatabaseError(`Error while get workbooks: ${err}`);
    }
  }

  save(book) {
    if (book.id == null) {
      try {
        const info = this.database.prepare(`INSERT INTO Books (login, path)
                           VALUES (?, ?)`)
          .run(book.login, book.path);
        return info.lastInsertRowid;
      } catch (e) {
        throw new DatabaseError(`Error while inserting book: ${e}`);
      }
    } else {
      try {
        this.database.prepare(`UPDATE Books
                         SET path  = ?,
                             login = ?
                         WHERE id = ?`)
          .run(book.path, book.login, book.id);
        return book.id;
      } catch (e) {
        throw new DatabaseError(`Error while updating book: ${e}`);
      }
    }
  }

  delete(id) {
    try {
      this.database.prepare(`DELETE
                             FROM Books
                             WHERE id = ?`)
        .run(id);
    } catch (err) {
      throw new DatabaseError(`Error while deleting book: ${err}`);
    }
  }

  deleteAll() {
    try {
      this.database.prepare(`DELETE
                             FROM Books`)
        .run();
    } catch (e) {
      throw new DatabaseError(`Error while deleting books: ${e}`);
    }
  }
}
