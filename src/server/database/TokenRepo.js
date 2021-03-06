import TokenModel from './TokenModel.js';
import DatabaseError from '../../lib/errors/DatabaseError.js';
import AbstractRepo from './AbstractRepo.js';

export default class TokenRepo extends AbstractRepo {
  static getTableName() {
    return 'Tokens';
  }

  dropTable() {
    try {
      this.database.prepare(`DROP TABLE ${TokenRepo.getTableName()}`).run();
    } catch (err) {
      throw new DatabaseError(`Error while dropping token table: ${err}`);
    }
  }

  createTable() {
    const tokenTableSchema = `CREATE TABLE ${TokenRepo.getTableName()}
                                 (
                                     uuid TEXT PRIMARY KEY NOT NULL,
                                     login TEXT UNIQUE NOT NULL,
                                     FOREIGN KEY (login) REFERENCES Users (login)
                                         ON DELETE CASCADE
                                 )`;
    try {
      this.database.prepare(tokenTableSchema).run();
    } catch (err) {
      throw new DatabaseError(`Error while creating token table: ${err}`);
    }
  }

  getByUuid(uuid) {
    try {
      const row = this.database.prepare(`SELECT login, uuid
                                         FROM ${TokenRepo.getTableName()}
                                         WHERE uuid = ?`).get(uuid);
      if (row) {
        return new TokenModel(row.login, row.uuid);
      }
      throw new Error(`no token with uuid ${uuid}`);
    } catch (err) {
      throw new DatabaseError(`Error while getting token: ${err}`);
    }
  }

  getByLogin(login) {
    try {
      const row = this.database.prepare(`SELECT login, uuid
                                         FROM ${TokenRepo.getTableName()}
                                         WHERE login = ?`).get(login);
      if (row) {
        return new TokenModel(row.login, row.uuid);
      }
      return undefined;
    } catch (err) {
      throw new DatabaseError(`Error while getting token: ${err}`);
    }
  }

  getAllTokens() {
    try {
      const rows = this.database.prepare(`SELECT *
                         FROM ${TokenRepo.getTableName()}`)
        .all();
      return TokenModel.fromSQLtoTokens(rows);
    } catch (err) {
      throw new DatabaseError(`Error while getting tokens: ${err}`);
    }
  }

  save(token) {
    let isPresent = true;
    try {
      this.getByUuid(token.uuid);
    } catch (err) {
      isPresent = false;
    }
    if (isPresent) {
      try {
        this.database.prepare(`UPDATE ${TokenRepo.getTableName()} SET login = ? WHERE uuid = ?`)
          .run(token.login, token.uuid);
      } catch (err) {
        throw new DatabaseError(`Error while updating token: ${err}`);
      }
    } else {
      try {
        this.database.prepare(`INSERT INTO ${TokenRepo.getTableName()} VALUES (?, ?)`)
          .run(token.uuid, token.login);
      } catch (err) {
        throw new DatabaseError(`Error while inserting token: ${err}`);
      }
    }
    return token.uuid;
  }

  delete(uuid) {
    try {
      this.database.prepare(`DELETE
                             FROM ${TokenRepo.getTableName()}
                             WHERE uuid = ?`)
        .run(uuid);
    } catch (err) {
      throw new DatabaseError(`Error while deleting token: ${err}`);
    }
  }

  deleteAll() {
    try {
      this.database.prepare(`DELETE
                             FROM ${TokenRepo.getTableName()}`)
        .run();
    } catch (e) {
      throw new DatabaseError(`Error while deleting tokens: ${e}`);
    }
  }
}
