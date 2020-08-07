import UserRepo from './UserRepo.js';
import WorkbookRepo from './WorkbookRepo.js';
import TokenRepo from './TokenRepo.js';
import AbstractLogger from '../../lib/logging/AbstractLogger.js';
import logLevel from '../../lib/logging/logLevel.js';

export default class DataRepo {
  constructor(database, logger) {
    this.instantiateRepos(database);
    this.setLogger(logger);
  }

  setLogger(logger) {
    if (!(logger instanceof AbstractLogger)) {
      throw new TypeError('logger must extend AbstractLogger');
    }
    this.logger = logger;
  }

  instantiateRepos(database) {
    this.userRepo = new UserRepo(database);
    this.tokenRepo = new TokenRepo(database);
    this.workbookRepo = new WorkbookRepo(database);
  }

  syncDatabaseStructure() {
    const repos = [
      this.userRepo,
      this.tokenRepo,
      this.workbookRepo,
    ];
    repos.forEach((repo) => this.syncRepo(repo));
  }

  syncRepo(repo) {
    const tableName = repo.constructor.getTableName();
    if (!repo.doesTableExist()) {
      repo.createTable();
      this.logger.sendLog(logLevel.info, `Table ${tableName} was created`);
    } else {
      this.logger.sendLog(logLevel.info, `Table ${tableName} already exits`);
    }
  }
}
