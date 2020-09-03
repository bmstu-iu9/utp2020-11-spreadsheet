import * as assert from 'assert';
import WorkbookModel from '../../../server/database/WorkbookModel.js';
import FormatError from '../../../lib/errors/FormatError.js';

describe('WorkbookModel', () => {
  describe('#constructor()', () => {
    it('should create book with null id', () => {
      const book = new WorkbookModel('login');
      assert.strictEqual(book.login, 'login');
      assert.strictEqual(book.id, null);
    });
    it('should create book', () => {
      const book = new WorkbookModel('login', 12);
      assert.strictEqual(book.login, 'login');
      assert.strictEqual(book.id, 12);
    });
    it('should throw error because of incorrect id', () => {
      assert.throws(() => {
        new WorkbookModel('login', 'notnumber');
      }, FormatError);
    });
  });
  describe('#setLogin()', () => {
    it('should set login', () => {
      const book = new WorkbookModel('login');
      book.setLogin('login1');
      assert.strictEqual(book.login, 'login1');
    });
    it('should throw error because of empty login', () => {
      const book = new WorkbookModel('login');
      assert.throws(() => book.setLogin(''));
    }, FormatError);
  });
  describe('#fromSQLtoBooks()', () => {
    it('should transform sql answer to array of books', () => {
      const rows = [
        {
          id: 1,
          login: 'login',
        },
        {
          id: 3,
          login: null,
        },
      ];
      assert.deepStrictEqual(
        WorkbookModel.fromSQLtoBooks(rows), [new WorkbookModel('login', 1),
          new WorkbookModel(null, 3)],
      );
    });
  });
});
