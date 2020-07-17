import * as assert from 'assert';
// eslint-disable-next-line import/named
import WorkbookModel from '../../../server/database/WorkbookModel.js';

describe('WorkbookModel', () => {
  describe('#constructor', () => {
    it('Should create book with null id', () => {
      const book = new WorkbookModel('path', 'login');
      assert.strictEqual(book.login, 'login');
      assert.strictEqual(book.id, null);
      assert.strictEqual(book.path, 'path');
    });
    it('Should create book', () => {
      const book = new WorkbookModel('path', 'login', 12);
      assert.strictEqual(book.login, 'login');
      assert.strictEqual(book.id, 12);
      assert.strictEqual(book.path, 'path');
    });
    it('Should throw error because of empty path', () => {
      assert.throws(() => {
        new WorkbookModel('', 'login');
      });
    });
  });
  describe('#set voids', () => {
    it('Should set path', () => {
      const book = new WorkbookModel('path', 'login');
      book.setPath('path1');
      assert.strictEqual(book.path, 'path1');
    });
    it('Should throw error because of empty path', () => {
      const book = new WorkbookModel('path', 'login');
      book.setPath('');
    });
    it('Should set login', () => {
      const book = new WorkbookModel('path', 'login');
      book.setLogin('login1');
      assert.strictEqual(book.login, 'login1');
    });
  });
});
