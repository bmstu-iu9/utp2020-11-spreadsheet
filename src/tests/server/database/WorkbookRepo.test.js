import assert from 'assert';
import Database from 'better-sqlite3';
import UserModel from '../../../server/database/UserModel.js';
import WorkbookRepo from '../../../server/database/WorkbookRepo.js';
import UserRepo from '../../../server/database/UserRepo.js';
import WorkbookModel from '../../../server/database/WorkbookModel.js';

const path = 'database.db';
const login = 'login';
const bookPath = 'path';
const anotherPath = 'qwerty';
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
    userRepo.save(new UserModel(login, 'abc', 0));
    userRepo.save(new UserModel(anotherLogin, 'abc', 0));
  });
  afterEach(() => {
    workbookRepo.dropTable();
    userRepo.dropTable();
  });
  after(() => database.close());

  describe('#deleteAll', () => {
    it('Should delete all books', () => {
      const inserting = database.prepare(
        'INSERT INTO Books (id, login, path) VALUES (?, ?, ?)',
      );
      inserting.run(null, login, bookPath);
      inserting.run(null, login, anotherPath);
      workbookRepo.deleteAll();
      assert.deepStrictEqual(
        database.prepare('SELECT * FROM Books').all(),
        [],
      );
    });
  });
  describe('#delete', () => {
    it('Should delete book', () => {
      const info = database.prepare('INSERT INTO Books (id, login, path) VALUES (?, ?, ?)')
        .run(null, login, bookPath);
      const id = info.lastInsertRowid;
      workbookRepo.delete(id);
      assert.deepStrictEqual(
        database.prepare('SELECT * FROM Books').all(),
        [],
      );
    });
  });
  describe('#getById', () => {
    it('Should get book by id', () => {
      const info = database.prepare('INSERT INTO Books (id, login, path) VALUES (?, ?, ?)')
        .run(null, login, bookPath);
      const id = info.lastInsertRowid;
      const book = workbookRepo.getById(id);
      assert.strictEqual(book.id, id);
      assert.strictEqual(book.login, login);
      assert.strictEqual(book.path, bookPath);
    });
    it('Should throw error because book doesn\'t exist', () => {
      const info = database.prepare('INSERT INTO Books (id, login, path) VALUES (?, ?, ?)')
        .run(null, login, bookPath);
      const id = info.lastInsertRowid;
      assert.throws(() => workbookRepo.getById(id + 1));
    });
  });

  describe('#detByLogin', () => {
    it('Should get all user\'s books', () => {
      const inserting = database.prepare(
        'INSERT INTO Books (id, login, path) VALUES (?, ?, ?)',
      );
      let info = inserting.run(null, login, bookPath);
      const id = info.lastInsertRowid;
      info = inserting.run(null, login, anotherPath);
      const anotherId = info.lastInsertRowid;
      inserting.run(null, null, 'path1');
      assert.deepStrictEqual(
        workbookRepo.getByLogin(login),
        [new WorkbookModel(bookPath, login, id),
          new WorkbookModel(anotherPath, login, anotherId)],
      );
    });

    it('Should throw error because user don\'t has books', () => {
      database.prepare('INSERT INTO Books (id, login, path) VALUES (?, ?, ?)')
        .run(null, anotherLogin, bookPath);
      assert.throws(() => workbookRepo.getByLogin(login));
    });
  });
  describe('#getAllBooks', () => {
    it('Should get all books', () => {
      const inserting = database.prepare(
        'INSERT INTO Books (id, login, path) VALUES (?, ?, ?)',
      );
      let info = inserting.run(null, login, bookPath);
      const id = info.lastInsertRowid;
      info = inserting.run(null, null, anotherPath);
      const anotherId = info.lastInsertRowid;
      assert.deepStrictEqual(
        workbookRepo.getAllBooks(),
        [new WorkbookModel(bookPath, login, id),
          new WorkbookModel(anotherPath, null, anotherId)],
      );
    });
  });
  describe('#save', () => {
    it('Should save new user', () => {
      const book = new WorkbookModel(bookPath, login);
      const id = workbookRepo.save(book);
      assert.deepStrictEqual(
        database.prepare('SELECT * FROM Books WHERE id = ?')
          .get(id),
        {
          id,
          path: bookPath,
          login,
        },
      );
    });
  });
});
