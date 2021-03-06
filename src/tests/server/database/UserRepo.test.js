import assert from 'assert';
import Database from 'better-sqlite3';
import UserModel from '../../../server/database/UserModel.js';
import UserRepo from '../../../server/database/UserRepo.js';
import WorkbookRepo from '../../../server/database/WorkbookRepo.js';
import DatabaseError from '../../../lib/errors/DatabaseError.js';

const path = 'database.db';
const login = 'login';
const password = 'password';
const isAdmin = false;
const anotherPassword = 'qwerty';
const anotherLogin = 'log';
let database;
let userRepo;
let workbookRepo;

describe('UserRepo', () => {
  before(() => {
    database = new Database(path);
    workbookRepo = new WorkbookRepo(database);
    userRepo = new UserRepo(database);
    workbookRepo.dropTable();
    userRepo.dropTable();
  });
  beforeEach(() => {
    userRepo.createTable();
  });
  afterEach(() => {
    userRepo.dropTable();
  });
  after(() => database.close());
  describe('#errors', () => {
    const allMethodsError = ['dropTable', 'createTable', 'save', 'get',
      'getAllUsers', 'delete', 'deleteAll'];
    allMethodsError.forEach((method) => {
      it(`should make error in #${method}()`, () => {
        const { prepare } = database;
        database.prepare = null;
        assert.throws(() => {
          userRepo[method]();
        }, DatabaseError);
        database.prepare = prepare;
      });
    });
  });
  describe('#save()', () => {
    it('should save new user', () => {
      const user = new UserModel(login, isAdmin, password);
      userRepo.save(user);
      assert.deepStrictEqual(
        database.prepare('SELECT * FROM Users WHERE login = ?')
          .get(user.login),
        {
          isAdmin: Number(isAdmin),
          login,
          password: UserModel.getHashedPassword(password),
        },
      );
    });
    it('should update existing user', () => {
      database.prepare('INSERT INTO Users (login, password, isAdmin) VALUES (?, ?, ?)')
        .run(login, UserModel.getHashedPassword(password), Number(isAdmin));
      const sameUser = userRepo.get(login);
      sameUser.setPassword(anotherPassword);
      userRepo.save(sameUser);
      assert.deepStrictEqual(
        database.prepare('SELECT * FROM Users WHERE login = ?')
          .get(sameUser.login),
        {
          isAdmin: Number(isAdmin),
          login,
          password: UserModel.getHashedPassword(anotherPassword),
        },
      );
    });
  });
  describe('#get()', () => {
    it('should get user by login', () => {
      database.prepare('INSERT INTO Users (login, password, isAdmin) VALUES (?, ?, ?)')
        .run(login, UserModel.getHashedPassword(password), Number(isAdmin));
      const anotherUser = userRepo.get(login);
      assert.strictEqual(anotherUser.login, login);
      assert.strictEqual(anotherUser.password, UserModel.getHashedPassword(password));
      assert.strictEqual(anotherUser.isAdmin, Number(isAdmin));
    });
    it('should return undefined because user doesn\'t exist', () => {
      database.prepare('INSERT INTO Users (login, password, isAdmin) VALUES (?, ?, ?)')
        .run(anotherLogin, password, Number(isAdmin));
      assert.strictEqual(userRepo.get(login), undefined);
    });
  });
  describe('#getAllUsers()', () => {
    it('should get all users', () => {
      const inserting = database.prepare('INSERT INTO Users (login, password, isAdmin) VALUES (?, ?, ?)');
      inserting.run(login, UserModel.getHashedPassword(password), Number(isAdmin));
      inserting.run(anotherLogin, UserModel.getHashedPassword(anotherPassword), Number(isAdmin));
      assert.deepStrictEqual(
        userRepo.getAllUsers(),
        [new UserModel(login, isAdmin, password),
          new UserModel(anotherLogin, isAdmin, anotherPassword)],
      );
    });
  });
  describe('#delete()', () => {
    it('should delete user', () => {
      database.prepare('INSERT INTO Users (login, password, isAdmin) VALUES (?, ?, ?)')
        .run(login, password, Number(isAdmin));
      userRepo.delete(login);
      assert.deepStrictEqual(
        database.prepare('SELECT * FROM Users').all(),
        [],
      );
    });
  });
  describe('#deleteAll()', () => {
    it('should delete all users', () => {
      const inserting = database.prepare('INSERT INTO Users (login, password, isAdmin) VALUES (?, ?, ?)');
      inserting.run(login, UserModel.getHashedPassword(password), Number(isAdmin));
      inserting.run(anotherLogin, UserModel.getHashedPassword(anotherPassword), Number(isAdmin));
      userRepo.deleteAll();
      assert.deepStrictEqual(
        database.prepare('SELECT * FROM Users').all(),
        [],
      );
    });
  });
});
