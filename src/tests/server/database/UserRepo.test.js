import assert from 'assert';
import Database from 'better-sqlite3';
import UserModel from '../../../server/database/UserModel.js';
import UserRepo from '../../../server/database/UserRepo.js';
import WorkbookRepo from '../../../server/database/WorkbookRepo.js';

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

  describe('#get', () => {
    it('Should get user by login', () => {
      database.prepare('INSERT INTO Users (login, password, isAdmin) VALUES (?, ?, ?)')
        .run(login, UserModel.getHashedPassword(password), Number(isAdmin));
      const anotherUser = userRepo.get(login);
      assert.strictEqual(anotherUser.login, login);
      assert.strictEqual(anotherUser.password, UserModel.getHashedPassword(password));
      assert.strictEqual(anotherUser.isAdmin, Number(isAdmin));
    });

    it('Should throw error because user doesn\'t exist', () => {
      database.prepare('INSERT INTO Users (login, password, isAdmin) VALUES (?, ?, ?)')
        .run(anotherLogin, password, Number(isAdmin));
      assert.throws(() => userRepo.get(login));
    });
  });
  describe('#save', () => {
    it('Should save new user', () => {
      const user = new UserModel(login, password, isAdmin);
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
    it('Should update existing user', () => {
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

  describe('#getAllUsers', () => {
    it('Should get all users', () => {
      const inserting = database.prepare('INSERT INTO Users (login, password, isAdmin) VALUES (?, ?, ?)');
      inserting.run(login, UserModel.getHashedPassword(password), Number(isAdmin));
      inserting.run(anotherLogin, UserModel.getHashedPassword(anotherPassword), Number(isAdmin));
      assert.deepStrictEqual(
        userRepo.getAllUsers(),
        [new UserModel(login, password, isAdmin),
          new UserModel(anotherLogin, anotherPassword, isAdmin)],
      );
    });
  });

  describe('#delete', () => {
    it('Should delete user', () => {
      database.prepare('INSERT INTO Users (login, password, isAdmin) VALUES (?, ?, ?)')
        .run(login, password, Number(isAdmin));
      userRepo.delete(login);
      assert.deepStrictEqual(
        database.prepare('SELECT * FROM Users').all(),
        [],
      );
    });
  });

  describe('#deleteAll', () => {
    it('Should delete all users', () => {
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
