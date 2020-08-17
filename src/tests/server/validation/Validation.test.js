import * as assert from 'assert';
import TestEnvironment from '../database/TestEnvironment.js';
import { result, Validation } from '../../../server/validation/Validation.js';
import UserModel from '../../../server/database/UserModel.js';

describe('Validation', () => {
  let environment;
  beforeEach(() => {
    environment = TestEnvironment.getInstance();
    environment.init();
  });
  afterEach(() => {
    TestEnvironment.destroyInstance();
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
    it('should create validator with dataRepo object', () => {
      const validator = new Validation(environment.dataRepo);
      assert.strictEqual(validator.dataRepo, environment.dataRepo);
    });
    it('should throw an exception for incorrect path to database', () => {
      assert.throws(() => {
        new Validation('~/db/database.db');
      }, TypeError);
    });
  });
  describe('#validateRegistration()', () => {
    it('should return \'OK\' for correct user', () => {
      const validator = new Validation(environment.dataRepo);
      assert.strictEqual(validator.validateRegistration('alexis', 'omgomg'), result.ok);
    });
    it('should ask for changing login', () => {
      environment.dataRepo.userRepo.save(new UserModel('alexis', 'omgomg', true));
      assert.strictEqual(Validation.checkLogin(NaN, NaN), false);
      const validator = new Validation(environment.dataRepo);
      assert.strictEqual(validator.validateRegistration('alexis', 'omgomg'), result.loginUnavailable);
    });
    it('should find whitespaces in login', () => {
      const validator = new Validation(environment.dataRepo);
      assert.strictEqual(validator.validateRegistration(' alexis', 'omgomg'), result.whitespacesInLogin);
    });
    it('should find whitespaces in password', () => {
      const validator = new Validation(environment.dataRepo);
      assert.strictEqual(validator.validateRegistration('alexis', ' omgomg'), result.whitespacesInPassword);
    });
    it('should report about empty login', () => {
      const validator = new Validation(environment.dataRepo);
      assert.strictEqual(validator.validateRegistration('', 'omgomg'), result.emptyLogin);
    });
    it('should report about short password', () => {
      const validator = new Validation(environment.dataRepo);
      assert.strictEqual(validator.validateRegistration('alexis', 'omg'), result.shortPassword);
    });
  });
  describe('#validateAuthorization()', () => {
    it('should return \'OK\' for correct user', () => {
      environment.dataRepo.userRepo.save(new UserModel('alexis', 'omgomg', true));
      const validator = new Validation(environment.dataRepo);
      assert.strictEqual(validator.validateAuthorization('alexis', 'omgomg'), result.ok);
    });
    it('should report about incorrect password', () => {
      environment.dataRepo.userRepo.save(new UserModel('alexis', 'omgomg', true));
      const validator = new Validation(environment.dataRepo);
      assert.strictEqual(validator.validateAuthorization('alexis', 'Omgomg'), result.incorrectPassword);
    });
    it('should report about nonexistent user', () => {
      const validator = new Validation(environment.dataRepo);
      assert.strictEqual(validator.validateAuthorization('alexis', 'omgomg'), result.nonExistentUser);
    });
  });
  describe('#validate()', () => {
    it('should return \'Empty login\' from validateRegistration()', () => {
      const validator = new Validation(environment.dataRepo);
      assert.strictEqual(validator.validate('', 'omgomg', true), result.emptyLogin);
    });
    it('should return \'Incorrect password\' from validateAuthorization()', () => {
      environment.dataRepo.userRepo.save(new UserModel('alexis', 'omgomg', true));
      const validator = new Validation(environment.dataRepo);
      assert.strictEqual(validator.validate('alexis', 'OMGomg', false), result.incorrectPassword);
    });
  });
});
