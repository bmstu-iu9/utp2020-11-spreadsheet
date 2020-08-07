import * as assert from 'assert';
import ConsoleLogger from '../../../lib/logging/ConsoleLogger.js';
import logLevel from '../../../lib/logging/logLevel.js';
import DataRepo from '../../../server/database/DataRepo.js';
import TestEnvironment from './TestEnvironment.js';

describe('DataRepo', () => {
  let environment;

  beforeEach(() => {
    environment = TestEnvironment.getInstance();
  });

  afterEach(() => {
    TestEnvironment.destroyInstance();
  });

  describe('#constructor()', () => {
    it('should create object with correct fields', () => {
      const logger = new ConsoleLogger(logLevel.info);
      const dataRepo = new DataRepo(environment.database, logger);
      const reposToCheck = [
        dataRepo.userRepo,
        dataRepo.tokenRepo,
        dataRepo.workbookRepo,
      ];
      reposToCheck.forEach((repo) => {
        assert.strictEqual(repo.database, environment.database);
      });
      assert.strictEqual(dataRepo.logger, logger);
    });
    it('should throw exception for non-database', () => {
      const logger = new ConsoleLogger(logLevel.info);
      assert.throws(() => {
        new DataRepo({}, logger);
      }, TypeError);
    });
    it('should throw exception for non-logger', () => {
      assert.throws(() => {
        new DataRepo(environment.database, {});
      }, TypeError);
    });
  });
  describe('#syncDatabaseStructure()', () => {
    const getRepos = () => [
      environment.dataRepo.userRepo,
      environment.dataRepo.tokenRepo,
      environment.dataRepo.workbookRepo,
    ];

    it('should create all repos', () => {
      environment.dataRepo.syncDatabaseStructure();
      const repos = getRepos();
      repos.forEach((repo) => {
        assert.strictEqual(repo.doesTableExist(), true);
      });
      assert.strictEqual(environment.dataRepo.logger.logs.length, repos.length);
    });
    it('should log that repos are already existing', () => {
      environment.dataRepo.syncDatabaseStructure();
      environment.dataRepo.syncDatabaseStructure();
      const repos = getRepos();
      assert.strictEqual(environment.dataRepo.logger.logs.length, 2 * repos.length);
    });
  });
});
