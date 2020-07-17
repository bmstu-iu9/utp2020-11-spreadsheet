import mock from 'mock-fs';
import assert from 'assert';
import DAO from '../../../server/database/DAO.js';
import UserModel from '../../../server/database/UserModel.js';
import UserRepo from '../../../server/database/UserRepo.js';

const login = 'login';
const password = 'password';
const isAdmin = 0;
describe('UserRepo', () => {
  describe('#save', () => {
    it('Should save new user', () => {
      const user = new UserModel(login, password, isAdmin);
      mock({
        'database.db': {},
      });
      const userRepo = new UserRepo(new DAO('database.db'));
      const resultOfTest = userRepo.createTable()
        .then(() => userRepo.save(user))
        .then(() => userRepo.get(login))
        .then((result) => {
          assert.strictEqual(result.login, login);
          assert.strictEqual(result.password, password);
          assert.strictEqual(result.isAdmin, isAdmin);
        });
      mock.restore();
      return resultOfTest;
    });
  });
  describe('#get', () => {
    it('Should get user by login', () => {
      mock({
        'database.db': {},
      });
      const dao = new DAO('database.db');
      const userRepo = new UserRepo(dao);
      const resultOfTest = userRepo.createTable()
        .then(() => {
          dao.run('INSERT INTO Users (login, password, isAdmin) VALUES (?, ?, ?)',
            [login, password, isAdmin]);
        })
        .then(() => userRepo.get(login))
        .then((result) => {
          assert.strictEqual(result.login, login);
          assert.strictEqual(result.password, password);
          assert.strictEqual(result.isAdmin, isAdmin);
        });
      mock.restore();
      return resultOfTest;
    });
    it('Should throw error because user doesn\'t exist', () => {
      mock({
        'database.db': {},
      });
      const dao = new DAO('database.db');
      const userRepo = new UserRepo(dao);
      assert.rejects(userRepo.createTable()
        .then(() => {
          dao.run('INSERT INTO Users (login, password, isAdmin) VALUES (?, ?, ?)',
            ['anotherlogin', password, isAdmin]);
        })
        .then(userRepo.get(login)));
      mock.restore();
    });
  });
  // todo здесь видно, что БД не пустая изначально

  // describe('#getAllUsers', () => {
  //   it('Should get all users', () => {
  //     mock({
  //       'database.db': {},
  //     });
  //     const dao = new DAO('/database.db');
  //     const userRepo = new UserRepo(dao);
  //     const resultOfTest = userRepo.createTable()
  //       .then(() => {
  //         dao.run('INSERT INTO Users (login, password, isAdmin) VALUES (?, ?, ?)',
  //           [login, password, isAdmin]);
  //         dao.run('INSERT INTO Users (login, password, isAdmin) VALUES (?, ?, ?)',
  //           [anotherLogin, anotherPassword, isAdmin]);
  //       })
  //       .then(() => userRepo.getAllUsers(login))
  //       .then((result) => {
  //         assert.strictEqual(result,
  //           [new UserModel(login, password, isAdmin),
  //             new UserModel(anotherLogin, anotherPassword, isAdmin)]);
  //       });
  //     mock.restore();
  //     return resultOfTest;
  //   });
  // });

  describe('#delete', () => {
    it('Should throw error because user does\'t exist', () => {
      mock({
        'database.db': {},
      });
      const dao = new DAO('database.db');
      const userRepo = new UserRepo(dao);
      assert.rejects(userRepo.createTable()
        .then(userRepo.delete(login)));
      mock.restore();
    });
  });
});
