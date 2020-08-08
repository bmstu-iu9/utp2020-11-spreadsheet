import fs from 'fs';
import Database from 'better-sqlite3';
import TokenModel from '../../../server/database/TokenModel.js';
import DataRepo from '../../../server/database/DataRepo.js';
import UserModel from '../../../server/database/UserModel.js';

export default class TestEnvironment {
  static getInstance() {
    if (this.instance === undefined || this.instance === null) {
      this.instance = new TestEnvironment();
    }
    return this.instance;
  }

  static destroyInstance() {
    this.instance.database.close();
    this.instance = null;
    //  хз почему, но работает, только если этого нет //
    fs.unlinkSync('database.db');
  }

  constructor() {
    this.database = new Database('database.db');
    this.dataRepo = new DataRepo(this.database);
    this.userTokens = [];
  }

  init() {
    this.dataRepo.createDatabase();
  }

  addUsers(n, withTokens = false) {
    for (let i = 0; i < n; i += 1) {
      const userId = i;
      const username = `test${userId}`;
      const user = new UserModel(username, '123', false);
      this.dataRepo.userRepo.save(user);
      let token = null;
      if (withTokens) {
        token = new TokenModel(username);
        this.dataRepo.tokenRepo.save(token);
      }
      this.userTokens.push({
        username,
        token,
      });
    }
  }
}
