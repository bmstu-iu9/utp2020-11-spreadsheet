import {DAO, databasePath} from './DAO.js'

export class WorkbookModel {
    static database = null;

    constructor(login = null, path) {
        if (path.length > 0) {
            this.id = null;
            this.path = path;
            this.login = login;
        } else {
            throw Error('Error while creating book: wrong format of data');
        }
    }

    static setDatabase(database) {
        WorkbookModel.database = database
    }

    static getById(id) {
        WorkbookModel.database.get(`SELECT id, login, path
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
        WorkbookModel.database.all(`SELECT id, login, path
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

    static getAllBooks() {
        WorkbookModel.database.all(`SELECT id, login, path
                                    FROM Books`, (err, rows) => {
            if (err) {
                throw Error(`Error while get workbooks: ${err}`);
            }
            let result = []
            rows.forEach((row) => {
                let book = new WorkbookModel(row.id);
                console.log(row.path)
                book.setPath(row.path);
                book.setLogin(row.login);
                result.push(book);
            })
            return result

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
                                        SET path  = ?,
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

