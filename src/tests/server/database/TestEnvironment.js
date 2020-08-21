import fs from 'fs';
import Database from 'better-sqlite3';
import TokenModel from '../../../server/database/TokenModel.js';
import DataRepo from '../../../server/database/DataRepo.js';
import UserModel from '../../../server/database/UserModel.js';
import logLevel from '../../../lib/logging/logLevel.js';
import TestLogger from '../../lib/logging/TestLogger.js';

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
    fs.unlinkSync('database.db');
  }

  constructor() {
    this.database = new Database('database.db');
    const logger = new TestLogger(logLevel.debug);
    this.dataRepo = new DataRepo(this.database, logger);
    this.userTokens = [];
  }

  init() {
    this.dataRepo.syncDatabaseStructure();
  }

  addUsers(n, withTokens = false) {
    for (let i = 0; i < n; i += 1) {
      const userId = this.userTokens.length + i;
      const username = `test${userId}`;
      const user = new UserModel(username, '123', Boolean(i % 2));
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
