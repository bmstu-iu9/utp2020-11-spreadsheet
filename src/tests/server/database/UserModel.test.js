import * as assert from 'assert';
import fs from 'fs';
import mock from 'mock-fs';
import {UserModel} from '../../../server/database/UserModel.js';
import {DAO} from '../../../server/database/DAO.js';


describe('UserModel', () => {
    describe('#constructor', () => {
        it('Should create user', () => {
            const user = new UserModel('login', 'password', 0);
            assert.strictEqual(user.login, 'login');
            assert.strictEqual(user.password, 'password');
            assert.strictEqual(user.isAdmin, 0)
        });
        it('Should throw error because of empty password', () => {
            assert.throws(() => {
                new UserModel('login', '', 0);
            });
        });
        it('Should throw error because of empty login', () => {
            assert.throws(() => {
                new UserModel('', 'password', 1);
            });
        });
        it('Should throw error because of invalid isAdmin', () => {
            assert.throws(() => {
                new UserModel('login', '', 2);
            });
        });
    });
    describe('#set voids', () => {
        it('Should set password', () => {
            const user = new UserModel('login', 'password', 0);
            user.setPassword('password1');
            assert.strictEqual(user.password, 'password1');
        });
        it('Should throw error because of empty password', () => {
            assert.throws(() => {
                const user = new UserModel('login', 'password', 0);
                user.setPassword('');
            });
        });
        it('Should set isAdmin', () => {
            const user = new UserModel('login', 'password', 0);
            user.setIsAdmin(1)
            assert.strictEqual(user.isAdmin, 1);
        });
        it('Should throw error because of invalid isAdmin', () => {
            assert.throws(() => {
                const user = new UserModel('login', 'password', 0);
                user.setIsAdmin(2);
            });
        });
    });

    describe('#save', () => {
        it('Should save new user', () => {
            const user = new UserModel('login', 'password', 0);
            mock({
                '~/database.db': {},
            });
            UserModel.setDatabase(new DAO('~/database.db').database);
            user.save();
            mock.restore();
        })
    });

});