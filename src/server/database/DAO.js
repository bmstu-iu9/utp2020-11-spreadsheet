import sqlite3 from 'sqlite3';

export default class DAO {
  constructor(databaseFilePath) {
    this.database = new sqlite3.Database(databaseFilePath, (err) => {
      if (err) {
        throw Error(`Error in connecting to database: ${err}`);
      }
    });
    // this.database.run('PRAGMA foreign_keys = ON;');
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.database.run(sql, params, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.database.get(sql, params, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.database.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

export const databasePath = './src/server/database/database.database';
