import * as assert from 'assert';
import Database from 'better-sqlite3';
import Validation from '../../../lib/validation/Validation.js';
import UserModel from '../../../server/database/UserModel.js';
import UserRepo from '../../../server/database/UserRepo.js';
import WorkbookRepo from '../../../server/database/WorkbookRepo.js';

const pathToDatabase = 'database.db';
const database = new Database(pathToDatabase);
const userRepo = new UserRepo(database);
const workbookRepo = new WorkbookRepo(database);

describe('Validation', () => {
  before(() => {
    workbookRepo.dropTable();
    userRepo.dropTable();
  });
  beforeEach(() => {
    userRepo.createTable();
  });
  afterEach(() => {
    userRepo.dropTable();
  });
  after(() => {
    database.close();
  });
  describe('#haveWhitespaces()', () => {
    it('should return true on \' a   bc d\'', () => {
      assert.strictEqual(Validation.haveWhitespaces(' a   bc d'), true);
    });
    it('should return false on \'abcd\'', () => {
      assert.strictEqual(Validation.haveWhitespaces('abcd'), false);
    });
  });
  describe('#constructor()', () => {
    it('should create validator with database object', () => {
      const validator = new Validation(pathToDatabase);
      assert.strictEqual(typeof validator.database, 'object');
      validator.close();
    });
    it('should throw an exception for incorrect path to database', () => {
      assert.throws(() => {
        new Validation('~/db/database.db');
      });
    });
  });
  describe('#setDatabase()', () => {
    it('should throw an exception for incorrect path to database', () => {
      const validator = new Validation(pathToDatabase);
      assert.throws(() => {
        validator.setDatabase('~/db/database.db');
      });
    });
  });
  describe('#validateRegistration()', () => {
    it('should return \'OK\' for correct user', () => {
      const validator = new Validation(pathToDatabase);
      assert.strictEqual(validator.validateRegistration('alexis', 'omgomg'), 'OK');
      validator.close();
    });
    it('should ask for changing login', () => {
      userRepo.save(new UserModel('alexis', 'omgomg', true));
      const validator = new Validation(pathToDatabase);
      assert.strictEqual(validator.validateRegistration('alexis', 'omgomg'), 'Login unavailable');
      validator.close();
    });
    it('should find whitespaces in login', () => {
      const validator = new Validation(pathToDatabase);
      assert.strictEqual(validator.validateRegistration(' alexis', 'omgomg'), 'Whitespaces in login');
      validator.close();
    });
    it('should find whitespaces in password', () => {
      const validator = new Validation(pathToDatabase);
      assert.strictEqual(validator.validateRegistration('alexis', ' omgomg'), 'Whitespaces in password');
      validator.close();
    });
    it('should report about empty login', () => {
      const validator = new Validation(pathToDatabase);
      assert.strictEqual(validator.validateRegistration('', 'omgomg'), 'Empty login');
      validator.close();
    });
    it('should report about short password', () => {
      const validator = new Validation(pathToDatabase);
      assert.strictEqual(validator.validateRegistration('alexis', 'omg'), 'Short password');
      validator.close();
    });
  });
  describe('#validateAuthorization()', () => {
    it('should return \'OK\' for correct user', () => {
      userRepo.save(new UserModel('alexis', 'omgomg', true));
      const validator = new Validation(pathToDatabase);
      assert.strictEqual(validator.validateAuthorization('alexis', 'omgomg'), 'OK');
      validator.close();
    });
    it('should report about incorrect password', () => {
      userRepo.save(new UserModel('alexis', 'omgomg', true));
      const validator = new Validation(pathToDatabase);
      assert.strictEqual(validator.validateAuthorization('alexis', 'Omgomg'), 'Incorrect password');
      validator.close();
    });
    it('should report about nonexistent user', () => {
      const validator = new Validation(pathToDatabase);
      assert.strictEqual(validator.validateAuthorization('alexis', 'omgomg'), 'Nonexistent user');
      validator.close();
    });
  });
  describe('#validate()', () => {
    it('should return \'Empty login\' from validateRegistration()', () => {
      const validator = new Validation(pathToDatabase);
      assert.strictEqual(validator.validate('', 'omgomg', true), 'Empty login');
      validator.close();
    });
    it('should return \'Incorrect password\' from validateAuthorization()', () => {
      userRepo.save(new UserModel('alexis', 'omgomg', true));
      const validator = new Validation(pathToDatabase);
      assert.strictEqual(validator.validate('alexis', 'OMGomg', false), 'Incorrect password');
      validator.close();
    });
    it('should throw an exception for closed database', () => {
      const validator = new Validation(pathToDatabase);
      validator.close();
      assert.throws(() => {
        validator.validate('alexis', 'omgomg', true);
      });
    });
  });
});
