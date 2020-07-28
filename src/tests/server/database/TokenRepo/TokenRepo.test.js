import * as assert from 'assert';
import TokenModel from '../../../../server/database/TokenModel.js';
import TestEnvironment from './TestEnvironment.js';

describe('TokenRepo', () => {
  let environment;

  beforeEach(() => {
    environment = TestEnvironment.getInstance();
  });
  afterEach(() => {
    TestEnvironment.destroyInstance();
  });

  describe('#dropTable()', () => {
    it('should drop table', () => {
      environment.init();
      environment.tokenRepo.dropTable();
      const tables = environment.database.prepare(
        'SELECT name FROM sqlite_master WHERE type=\'table\' AND name=\'Tokens\'',
      ).all();
      assert.strictEqual(tables.length, 0);
    });
    it('should raise an exception if table does not exist', () => {
      assert.throws(() => {
        environment.tokenRepo.dropTable();
      });
    });
  });
  describe('#createTable()', () => {
    it('should create a table', () => {
      environment.tokenRepo.createTable();
      const columns = environment.database.prepare('PRAGMA table_info(Tokens)').all();
      const expected = [
        {
          cid: 0,
          name: 'uuid',
          type: 'TEXT',
          notnull: 1,
          dflt_value: null,
          pk: 1,
        },
        {
          cid: 1,
          name: 'login',
          type: 'TEXT',
          notnull: 1,
          dflt_value: null,
          pk: 0,
        },
      ];
      assert.deepStrictEqual(columns, expected);
    });
    it('should raise an exception if table exists', () => {
      environment.init();
      assert.throws(() => {
        environment.tokenRepo.createTable();
      });
    });
  });
  describe('#getByUuid()', () => {
    it('should return token with correct username', () => {
      environment.init();
      environment.addUsers(1, true);
      const expectedToken = environment.userTokens[0].token;
      const { uuid } = expectedToken;
      const actualToken = environment.tokenRepo.getByUuid(uuid);
      assert.deepStrictEqual(actualToken, expectedToken);
    });
    it('should throw an exception when token not found', () => {
      environment.init();
      assert.throws(() => {
        environment.tokenRepo.getByUuid('228');
      });
    });
  });
  describe('#getByLogin()', () => {
    it('should return token with correct UUID', () => {
      environment.init();
      environment.addUsers(1, true);
      const userToken = environment.userTokens[0];
      const actualToken = environment.tokenRepo.getByLogin(userToken.username);
      assert.deepStrictEqual(actualToken, userToken.token);
    });
    it('should throw an exception when token not found', () => {
      environment.init();
      assert.throws(() => {
        environment.tokenRepo.getByLogin('228');
      });
    });
  });
  describe('#getAllTokens()', () => {
    it('should return 2 tokens', () => {
      environment.init();
      environment.addUsers(2, true);
      const tokens = environment.tokenRepo.getAllTokens();
      assert.strictEqual(tokens.length, 2);
    });
    it('should throw an exception for absent table', () => {
      assert.throws(() => {
        environment.tokenRepo.getAllTokens();
      });
    });
  });
  describe('#save()', () => {
    it('should save new token', () => {
      environment.init();
      environment.addUsers(1);
      const token = new TokenModel(environment.userTokens[0].username);
      assert.strictEqual(environment.tokenRepo.getAllTokens().length, 0);
      environment.tokenRepo.save(token);
      assert.strictEqual(environment.tokenRepo.getAllTokens().length, 1);
    });
    it('should throw an exception for absent table', () => {
      const token = new TokenModel('test');
      assert.throws(() => {
        environment.tokenRepo.save(token);
      });
    });
    it('should update existing token with a new login', () => {
      environment.init();
      environment.addUsers(1, true);
      environment.addUsers(1);
      const { token } = environment.userTokens[0];
      token.login = environment.userTokens[1].username;
      environment.tokenRepo.save(token);
      assert.deepStrictEqual(environment.tokenRepo.getAllTokens(), [token]);
    });
    it('should throw an exception for invalid login', () => {
      environment.init();
      environment.addUsers(1, true);
      const { token } = environment.userTokens[0];
      token.login += '228';
      assert.throws(() => {
        environment.tokenRepo.save(token);
      });
    });
  });
  describe('#delete()', () => {
    it('should delete token', () => {
      environment.init();
      environment.addUsers(2, true);
      const token1 = environment.userTokens[0].token;
      const token2 = environment.userTokens[1].token;
      environment.tokenRepo.delete(token1.uuid);
      assert.deepStrictEqual(environment.tokenRepo.getAllTokens(), [token2]);
    });
    it('should throw an exception for absent table', () => {
      assert.throws(() => {
        environment.tokenRepo.delete('');
      });
    });
  });
  describe('#deleteAll()', () => {
    it('should delete 2 tokens', () => {
      environment.init();
      environment.addUsers(2, true);
      assert.strictEqual(environment.tokenRepo.getAllTokens().length, 2);
      environment.tokenRepo.deleteAll();
      assert.strictEqual(environment.tokenRepo.getAllTokens().length, 0);
    });
    it('should throw an exception for absent table', () => {
      assert.throws(() => {
        environment.tokenRepo.deleteAll();
      });
    });
  });
});
