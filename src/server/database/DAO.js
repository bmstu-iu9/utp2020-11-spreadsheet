import sqlite3 from "sqlite3";

const userTableSchema = `CREATE TABLE IF NOT EXISTS Users
                         (
                             login    TEXT    NOT NULL PRIMARY KEY,
                             password BLOB    NOT NULL,
                             isAdmin  INTEGER NOT NULL DEFAULT 0
                         );
`

const workbookTableSchema = `CREATE TABLE IF NOT EXISTS Books
                             (
                                 id    INTEGER     NOT NULL PRIMARY KEY,
                                 login TEXT,
                                 path  VARCHAR(30) NOT NULL,
                                 FOREIGN KEY (login) REFERENCES Users (login)
                             )`

export class DAO {
    constructor(dbFilePath) {
        this.database = new sqlite3.Database(dbFilePath, (err) => {
            if (err) {
                throw Error(`Error in connecting to database: ${err}`);
            }
        })
        this.database.run(`PRAGMA foreign_keys = ON;`)
        this.database.run(userTableSchema, (err) => {
            if (err) {
                throw Error(`Error while creating user table: ${err}`);
            }
        });
        this.database.run(workbookTableSchema, (err) => {
            if (err) {
                throw Error(`Error while creating book table: ${err}`);
            }
        });
    }
}


export const databasePath = './src/server/database/database.db'