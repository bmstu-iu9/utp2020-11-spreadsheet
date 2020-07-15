import {DAO, databasePath} from './DAO.js'

export class UserModel {
    static database = new DAO(databasePath).database;

    constructor(login) {
        this.login = login;
    }

    static get(login) {
        this.database.get(`SELECT *
                           FROM Users
                           WHERE login = ?`, [login], (err, row) => {
            if (err) {
                throw Error(`Error while get user: ${err}`);
            }
            if (row) {
                console.log(row.login, row.isAdmin);
                let user = new UserModel(row.login);
                user.setIsAdmin(row.isAdmin);
                user.setPassword(row.password);
                return user;
            } else {
                throw Error(`Error while get user: no user with login ${login} `);
            }
        })
    }

    setIsAdmin(isAdmin) {
        this.isAdmin = isAdmin;
    }

    setPassword(password) {
        this.password = password;
    }

    save() {
        UserModel.database.run(`INSERT INTO Users (login, password, isAdmin)
                                VALUES (?, ?, ?)
                                ON CONFLICT(login) DO UPDATE SET password = ?,
                                                                 isAdmin = ?;`,
            [this.login, this.password, this.isAdmin, this.password, this.isAdmin], (err) => {
                if (err) {
                    throw Error(`Error while inserting user: ${err}`);
                }
            })
    }

    delete() {
        UserModel.database.run(`DELETE
                                FROM Users
                                WHERE login = ?`, [this.login], (err) => {
            if (err) {
                throw Error(`Error while deleting user: ${err}`);
            }
        })
    }
}

let user = new UserModel('bbhs');
user.setIsAdmin(true);
user.setPassword(123);
user.save()
user = UserModel.get('bbhs')
UserModel.get('abs')