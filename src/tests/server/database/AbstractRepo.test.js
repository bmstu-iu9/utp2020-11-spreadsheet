import * as assert from 'assert';
import AbstractRepo from '../../../server/database/AbstractRepo.js';
import NotImplementedError from '../../../lib/errors/NotImplementedError.js';
import TestEnvironment from './TestEnvironment.js';

class TestRepo extends AbstractRepo {
  static getTableName() {
    return 'randomTestName';
  }
}

describe('AbstractRepo', () => {
  let environment;

  beforeEach(() => {
    environment = TestEnvironment.getInstance();
  });
  afterEach(() => {
    TestEnvironment.destroyInstance();
  });

  describe('#constructor()', () => {
    it('should create object with correct fields', () => {
      const repo = new TestRepo(environment.database);
      assert.strictEqual(repo.database, environment.database);
    });
    it('should throw an exception for non-database', () => {
      assert.throws(() => {
        new TestRepo({});
      }, TypeError);
    });
  });
  describe('#getTableName()', () => {
    it('should throw implementation error', () => {
      assert.throws(() => {
        AbstractRepo.getTableName();
      }, NotImplementedError);
    });
  });
  describe('#doesTableExist()', () => {
    it('should return false for an empty database', () => {
      const repo = new TestRepo(environment.database);
      assert.strictEqual(repo.doesTableExist(), false);
    });
    it('should return true for existing table', () => {
      const repo = new TestRepo(environment.database);
      environment.database.prepare(`CREATE TABLE ${TestRepo.getTableName()} (id INTEGER PRIMARY KEY)`).run();
      assert.strictEqual(repo.doesTableExist(), true);
    });
  });
});
