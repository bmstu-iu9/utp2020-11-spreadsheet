import WorkbookModel from './WorkbookModel.js';

export default class WorkbookRepo {
  constructor(dao) {
    this.dao = dao;
  }

  createTable() {
    const workbookTableSchema = `CREATE TABLE IF NOT EXISTS Books
                                 (
                                     id    INTEGER     NOT NULL PRIMARY KEY,
                                     login TEXT,
                                     path  VARCHAR(30) NOT NULL,
                                     FOREIGN KEY (login) REFERENCES Users (login)
                                 )`;
    return this.dao.run(workbookTableSchema, (err) => {
      if (err) {
        throw Error(`Error while creating book table: ${err}`);
      }
    });
  }

  getById(id) {
    return this.dao.get(`SELECT id, login, path
                         FROM Books
                         WHERE id = ?`, [id], (err, row) => {
      if (err) {
        throw Error(`Error while get workbook: ${err}`);
      }
      if (row) {
        return new WorkbookModel(row.path, row.login, row.id);
      }
      throw Error(`Error while get book: no book with id ${id}`);
    });
  }

  getByLogin(login) {
    return this.dao.all(`SELECT id, login, path
                         FROM Books
                         WHERE login = ?`, [login], (err, rows) => {
      if (err) {
        throw Error(`Error while get workbooks: ${err}`);
      }
      if (rows) {
        const result = [];
        rows.forEach((row) => {
          result.push(new WorkbookModel(row.path, row.login, row.id));
        });
        return result;
      }
      throw Error(`Error while get books: no books with login ${login}`);
    });
  }

  getAllBooks() {
    return this.dao.all(`SELECT id, login, path
                         FROM Books`, (err, rows) => {
      if (err) {
        throw Error(`Error while get workbooks: ${err}`);
      }
      const result = [];
      rows.forEach((row) => {
        result.push(new WorkbookModel(row.path, row.login, row.id));
      });
      return result;
    });
  }

  save(book) {
    if (book.id == null) {
      return this.dao.run(`INSERT INTO Books (login, path)
                           VALUES (?, ?)`,
      [this.login, this.path], (err) => {
        if (err) {
          throw Error(`Error while inserting book: ${err}`);
        }
      });
    }
    return this.dao.run(`UPDATE Books
                         SET path  = ?,
                             login = ?
                         WHERE id = ?`,
    [book.path, book.login, book.id], (err) => {
      if (err) {
        throw Error(`Error while updating book: ${err}`);
      }
    });
  }

  delete(book) {
    return this.dao.run(`DELETE
                         FROM Books
                         WHERE id = ?`, [book.id], (err) => {
      if (err) {
        throw Error(`Error while deleting book: ${err}`);
      }
    });
  }
}
