import fs from 'fs';
import Database from 'better-sqlite3';
import TokenRepo from '../../../../server/database/TokenRepo.js';
import TokenModel from '../../../../server/database/TokenModel.js';
import UserRepo from '../../../../server/database/UserRepo.js';
import UserModel from '../../../../server/database/UserModel.js';

export default class TestEnvironment {
  static getInstance() {
    if (this.instance === undefined || this.instance === null) {
      this.instance = new TestEnvironment();
    }
    return this.instance;
  }

  static destroyInstance() {
    TestEnvironment.instance = null;
    fs.unlinkSync('database.db');
  }

  constructor() {
    this.database = new Database('database.db');
    this.userRepo = new UserRepo(this.database);
    this.tokenRepo = new TokenRepo(this.database);
    this.userTokens = [];
  }

  init() {
    this.userRepo.createTable();
    this.tokenRepo.createTable();
  }

  addUsers(n, withTokens = false) {
    for (let i = 0; i < n; i += 1) {
      const userId = this.userTokens + i;
      const username = `test${userId.toString()}`;
      const user = new UserModel(username, '123', false);
      this.userRepo.save(user);
      let token = null;
      if (withTokens) {
        token = new TokenModel(username);
        this.tokenRepo.save(token);
      }
      this.userTokens.push({
        username,
        token,
      });
    }
  }
}
