import * as assert from 'assert';
import WorkbookModel from '../../../server/database/WorkbookModel.js';

const path = 'path.json';
describe('WorkbookModel', () => {
  describe('#constructor', () => {
    it('Should create book with null id', () => {
      const book = new WorkbookModel(path, 'login');
      assert.strictEqual(book.login, 'login');
      assert.strictEqual(book.id, null);
      assert.strictEqual(book.path, path);
    });
    it('Should create book', () => {
      const book = new WorkbookModel(path, 'login', 12);
      assert.strictEqual(book.login, 'login');
      assert.strictEqual(book.id, 12);
      assert.strictEqual(book.path, path);
    });
    it('Should throw error because of incorrect id', () => {
      assert.throws(() => {
        new WorkbookModel(path, 'login', 'notnumber');
      });
    });
  });
  describe('#set voids', () => {
    it('Should set path', () => {
      const book = new WorkbookModel(path, 'login');
      book.setPath('path1.json');
      assert.strictEqual(book.path, 'path1.json');
    });
    it('Should throw error because of incorrect path', () => {
      const book = new WorkbookModel(path, 'login');
      assert.throws(() => book.setPath('path'));
    });
    it('Should set login', () => {
      const book = new WorkbookModel(path, 'login');
      book.setLogin('login1');
      assert.strictEqual(book.login, 'login1');
    });
    it('Should throw error because of empty login', () => {
      const book = new WorkbookModel(path, 'login');
      assert.throws(() => book.setLogin(''));
    });
  });
  describe('#fromSQLtoBooks', () => {
    it('Should transform sql answer to array of books', () => {
      const rows = [
        {
          id: 1,
          login: 'login',
          path,
        },
        {
          id: 3,
          login: null,
          path: 'path1.json',
        },
      ];
      assert.deepStrictEqual(
        WorkbookModel.fromSQLtoBooks(rows), [new WorkbookModel(path, 'login', 1),
          new WorkbookModel('path1.json', null, 3)],
      );
    });
  });
});
