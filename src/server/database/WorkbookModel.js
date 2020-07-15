import {DAO, databasePath} from './DAO.js'

export class WorkbookModel {
    static database = new DAO(databasePath).database;

    constructor(login, path) {
        this.id = null;
        this.path = path
        this.login = login
    }

    static getById(id) {
        this.database.get(`SELECT id, login, path
                           FROM Books
                           WHERE id = ?`, [id], (err, row) => {
            if (err) {
                throw Error(`Error while get workbook: ${err}`);
            }
            if (row) {
                let book = new WorkbookModel(row.id);
                book.setPath(row.path);
                book.setLogin(row.login);
                return book;
            } else {
                throw Error(`Error while get book: no book with id ${id}`);
            }
        })
    }

    static getByLogin(login) {
        this.database.all(`SELECT id, login, path
                           FROM Books
                           WHERE login = ?`, [login], (err, rows) => {
            if (err) {
                throw Error(`Error while get workbooks: ${err}`);
            }
            if (rows) {
                let result = []
                rows.forEach((row) => {
                    let book = new WorkbookModel(row.id);
                    console.log(row.path)
                    book.setPath(row.path);
                    book.setLogin(row.login);
                    result.push(book);
                })
                return result
            } else {
                throw Error(`Error while get books: no books with login ${login}`);
            }
        })
    }

    setLogin(login) {
        this.login = login;
    }

    setPath(path) {
        this.path = path;
    }

    save() {
        if (this.id == null) {
            WorkbookModel.database.run(`INSERT INTO Books (login, path)
                                        VALUES (?, ?)`,
                [this.login, this.path], (err) => {
                    if (err) {
                        throw Error(`Error while inserting book: ${err}`);
                    }
                })
        } else {
            WorkbookModel.database.run(`UPDATE Books
                                        SET path = ?,
                                            login = ?
                                        WHERE id = ?`,
                [this.path, this.login, this.id], (err) => {
                    if (err) {
                        throw Error(`Error while updating book: ${err}`);
                    }
                })
        }
    }

    delete() {
        WorkbookModel.database.run(`DELETE
                                    FROM Books
                                    WHERE id = ?`, [this.id], (err) => {
            if (err) {
                throw Error(`Error while deleting book: ${err}`);
            }
        })
    }
}

let book = new WorkbookModel('bbhs', 'gjh');
book.save()
book = WorkbookModel.getByLogin('bbhs')
