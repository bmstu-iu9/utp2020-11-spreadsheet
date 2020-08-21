import assert from 'assert';
import Database from 'better-sqlite3';
import UserModel from '../../../server/database/UserModel.js';
import WorkbookRepo from '../../../server/database/WorkbookRepo.js';
import UserRepo from '../../../server/database/UserRepo.js';
import WorkbookModel from '../../../server/database/WorkbookModel.js';
import DatabaseError from '../../../lib/errors/DatabaseError.js';

const path = 'database.db';
const login = 'login';
const anotherLogin = 'login2';
let database;
let workbookRepo;
let userRepo;

describe('WorkbookRepo', () => {
  before(() => {
    database = new Database(path);
    workbookRepo = new WorkbookRepo(database);
    userRepo = new UserRepo(database);
    workbookRepo.dropTable();
    userRepo.dropTable();
  });
  beforeEach(() => {
    workbookRepo.createTable();
    // Where should be user's table because login is foreign key to user
    userRepo.createTable();
    userRepo.save(new UserModel(login, 'abcdefg', false));
    userRepo.save(new UserModel(anotherLogin, 'abcefg', false));
  });
  afterEach(() => {
    workbookRepo.dropTable();
    userRepo.dropTable();
  });
  after(() => database.close());
  describe('#errors', () => {
    const allMethodsError = ['dropTable', 'createTable', 'getById', 'getByLogin',
      'getAllBooks', 'delete', 'deleteAll'];
    allMethodsError.forEach((method) => {
      it(`should make error in #${method}()`, () => {
        const { prepare } = database;
        database.prepare = null;
        assert.throws(() => {
          workbookRepo[method]();
        }, DatabaseError);
        database.prepare = prepare;
      });
    });
    it('should make error in #save()', () => {
      const { prepare } = database;
      database.prepare = null;
      assert.throws(() => {
        workbookRepo.save({ id: null });
      }, DatabaseError);
      assert.throws(() => {
        workbookRepo.save({ id: 1 });
      }, DatabaseError);
      database.prepare = prepare;
    });
  });
  describe('#getById()', () => {
    it('should get book by id', () => {
      const info = database.prepare('INSERT INTO Books (id, login) VALUES (?, ?)')
        .run(null, login);
      const id = info.lastInsertRowid;
      const book = workbookRepo.getById(id);
      assert.strictEqual(book.id, id);
      assert.strictEqual(book.login, login);
    });
    it('should throw error because book doesn\'t exist', () => {
      const info = database.prepare('INSERT INTO Books (id, login) VALUES (?, ?)')
        .run(null, login);
      const id = info.lastInsertRowid;
      assert.throws(() => workbookRepo.getById(id + 1), DatabaseError);
    });
  });
  describe('#detByLogin()', () => {
    it('should get all user\'s books', () => {
      const inserting = database.prepare(
        'INSERT INTO Books (id, login) VALUES (?, ?)',
      );
      let info = inserting.run(null, login);
      const id = info.lastInsertRowid;
      info = inserting.run(null, login);
      const anotherId = info.lastInsertRowid;
      inserting.run(null, null);
      assert.deepStrictEqual(
        workbookRepo.getByLogin(login),
        [new WorkbookModel(login, id),
          new WorkbookModel(login, anotherId)],
      );
    });
    it('should throw error because user don\'t has books', () => {
      database.prepare('INSERT INTO Books (id, login) VALUES (?, ?)')
        .run(null, anotherLogin);
      assert.throws(() => workbookRepo.getByLogin(login), DatabaseError);
    });
  });
  describe('#getAllBooks()', () => {
    it('should get all books', () => {
      const inserting = database.prepare(
        'INSERT INTO Books (id, login) VALUES (?, ?)',
      );
      let info = inserting.run(null, login);
      const id = info.lastInsertRowid;
      info = inserting.run(null, null);
      const anotherId = info.lastInsertRowid;
      assert.deepStrictEqual(
        workbookRepo.getAllBooks(),
        [new WorkbookModel(login, id),
          new WorkbookModel(null, anotherId)],
      );
    });
  });
  describe('#save()', () => {
    it('should save new user', () => {
      const book = new WorkbookModel(login);
      const id = workbookRepo.save(book);
      assert.deepStrictEqual(
        database.prepare('SELECT * FROM Books WHERE id = ?')
          .get(id),
        {
          id,
          login,
        },
      );
    });
  });
  describe('#delete()', () => {
    it('should delete book', () => {
      const info = database.prepare('INSERT INTO Books (id, login) VALUES (?, ?)')
        .run(null, login);
      const id = info.lastInsertRowid;
      workbookRepo.delete(id);
      assert.deepStrictEqual(
        database.prepare('SELECT * FROM Books').all(),
        [],
      );
    });
  });
  describe('#deleteAll()', () => {
    it('should delete all books', () => {
      const inserting = database.prepare(
        'INSERT INTO Books (id, login) VALUES (?, ?)',
      );
      inserting.run(null, login);
      inserting.run(null, login);
      workbookRepo.deleteAll();
      assert.deepStrictEqual(
        database.prepare('SELECT * FROM Books').all(),
        [],
      );
    });
  });
});
