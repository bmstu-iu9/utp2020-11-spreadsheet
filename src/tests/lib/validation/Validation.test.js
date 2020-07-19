import * as assert from 'assert';
import Database from 'better-sqlite3';
import Validation from '../../../lib/validation/Validation.js';
import UserModel from '../../../server/database/UserModel.js';
import UserRepo from '../../../server/database/UserRepo.js';

const pathToDatabase = 'database.db';
const database = new Database(pathToDatabase);
const userRepo = new UserRepo(database);

describe('Validation', () => {
  before(() => {
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
  describe('#setNewDatabase()', () => {
    it('should throw an exception for incorrect path to database', () => {
      const validator = new Validation(pathToDatabase);
      assert.throws(() => {
        validator.setNewDatabase('~/db/database.db');
      });
    });
  });
  describe('#validateRegistration()', () => {
    it('should return \'OK\' for correct user', () => {
      const validator = new Validation(pathToDatabase);
      assert.strictEqual(validator.validateRegistration('alexis', 'omg'), 'OK');
      validator.close();
    });
    it('should ask for changing login', () => {
      userRepo.save(new UserModel('alexis', 'omg', true));
      const validator = new Validation(pathToDatabase);
      assert.strictEqual(validator.validateRegistration('alexis', 'omg'), 'Need to change login');
      validator.close();
    });
    it('should find whitespaces in login', () => {
      const validator = new Validation(pathToDatabase);
      assert.strictEqual(validator.validateRegistration(' alexis', 'omg'), 'Whitespaces in login');
      validator.close();
    });
    it('should find whitespaces in password', () => {
      const validator = new Validation(pathToDatabase);
      assert.strictEqual(validator.validateRegistration('alexis', ' omg'), 'Whitespaces in password');
      validator.close();
    });
    it('should report about empty login', () => {
      const validator = new Validation(pathToDatabase);
      assert.strictEqual(validator.validateRegistration('', 'omg'), 'Empty login');
      validator.close();
    });
    it('should report about empty password', () => {
      const validator = new Validation(pathToDatabase);
      assert.strictEqual(validator.validateRegistration('alexis', ''), 'Empty password');
      validator.close();
    });
  });
  describe('#validateAuthorization()', () => {
    it('should return \'OK\' for correct user', () => {
      userRepo.save(new UserModel('alexis', 'omg', true));
      const validator = new Validation(pathToDatabase);
      assert.strictEqual(validator.validateAuthorization('alexis', 'omg'), 'OK');
      validator.close();
    });
    it('should report about incorrect password', () => {
      userRepo.save(new UserModel('alexis', 'omg', true));
      const validator = new Validation(pathToDatabase);
      assert.strictEqual(validator.validateAuthorization('alexis', 'OMG'), 'Incorrect password');
      validator.close();
    });
    it('should report about nonexistent user', () => {
      const validator = new Validation(pathToDatabase);
      assert.strictEqual(validator.validateAuthorization('alexis', 'omg'), 'Nonexistent user');
      validator.close();
    });
  });
  describe('#validate()', () => {
    it('should return \'Empty login\' from validateRegistration()', () => {
      const validator = new Validation(pathToDatabase);
      assert.strictEqual(validator.validate('', 'omg', true), 'Empty login');
      validator.close();
    });
    it('should return \'Incorrect password\' from validateAuthorization()', () => {
      userRepo.save(new UserModel('alexis', 'omg', true));
      const validator = new Validation(pathToDatabase);
      assert.strictEqual(validator.validate('alexis', 'OMG', false), 'Incorrect password');
      validator.close();
    });
    it('should throw an exception for closed database', () => {
      const validator = new Validation(pathToDatabase);
      validator.close();
      assert.throws(() => {
        validator.validate('alexis', 'omg', true);
      });
    });
  });
});
