import UserRepo from './UserRepo.js';
import WorkbookRepo from './WorkbookRepo.js';
import TokenRepo from './TokenRepo.js';

export default class DataRepo {
  constructor(database) {
    this.userRepo = new UserRepo(database);
    this.tokenRepo = new TokenRepo(database);
    this.workbookRepo = new WorkbookRepo(database);
  }

  createDatabase() {
    this.userRepo.createTable();
    this.tokenRepo.createTable();
    this.workbookRepo.createTable();
  }
}
