import * as assert from 'assert';
import mock from 'mock-fs';
import {WorkbookModel} from '../../../server/database/WorkbookModel.js';
import {DAO} from '../../../server/database/DAO.js';

describe('WorkbookModel', () => {
    describe('#constructor', () => {
        it('Should create book', () => {
            const book = new WorkbookModel('login', 'path');
            assert.strictEqual(book.login, 'login');
            assert.strictEqual(book.id, null);
            assert.strictEqual(book.path, 'path');
        });
        it('Should throw error because of empty path', () => {
            assert.throws(() => {
                new WorkbookModel('login', '');
            });
        });
    });
    describe('#set voids', () => {
        it('Should set path', () => {
            const book = new WorkbookModel('login', 'path');
            book.setPath('path1')
            assert.strictEqual(book.path, 'path1');
        });
        it('Should throw error because of empty path', () => {
            const book = new WorkbookModel('login', 'path')
            book.setPath('');
        })
        it('Should set login', () => {
            const book = new WorkbookModel('login', 'path');
            book.setLogin('login1')
            assert.strictEqual(book.login, 'login1');
        });
    });
});