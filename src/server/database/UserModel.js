export class UserModel {
    static database = null;

    constructor(login, password, isAdmin) {
        if (login.length > 0 && password.length > 0 && (isAdmin === 1 || isAdmin === 0)) {
            this.login = login;
            this.password = password;
            this.isAdmin = isAdmin;
        } else {
            throw Error('Error while creating user: wrong format of data')
        }
    }

    static setDatabase(database) {
        UserModel.database = database
    }

    static get(login) {
        UserModel.database.get(`SELECT *
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

    static getAllUsers() {
        UserModel.database.all(`SELECT login, password, isAdmin
                                FROM Users `, (err, rows) => {
            if (err) {
                throw Error(`Error while get users: ${err}`);
            }
            let result = []
            rows.forEach((row) => {
                const user = new UserModel(row.login, row.password, row.isAdmin);
                result.push(user);
            })
            return result
        })
    }

    setIsAdmin(isAdmin) {
        if (isAdmin === 1 || isAdmin === 0) {
            this.isAdmin = isAdmin;
        } else {
            throw Error('Error while creating user: wrong format of data')
        }
    }

    setPassword(password) {
        if (password.length > 0) {
            this.password = password;
        } else {
            throw Error('Error while creating user: wrong format of data')
        }
    }

    save() {
        UserModel.database.run(`INSERT INTO Users (login, password, isAdmin)
                                VALUES (?, ?, ?)
                                ON CONFLICT(login) DO UPDATE SET password = ?,
                                                                 isAdmin = ?;`,
            [this.login, this.password, this.isAdmin, this.password, this.isAdmin], (err) => {
                if (err) {
                    throw Error(`Error while inserting or updating user: ${err}`);
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
