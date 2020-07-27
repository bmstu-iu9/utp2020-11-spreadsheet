import * as assert from 'assert';
import HeaderMatcher from '../../../server/authorization/HeaderMatcher.js';

describe('TokenParser', () => {
  describe('#constructor()', () => {
    it('should create parser with correct parameters', () => {
      const name = 'Authorization';
      const prefix = 'Token';
      const parser = new HeaderMatcher(name, prefix);
      assert.strictEqual(parser.name, name);
      assert.strictEqual(parser.prefix, prefix);
    });
    it('should throw an exception for non-string name', () => {
      const name = true;
      const prefix = 'pref';
      assert.throws(() => {
        new HeaderMatcher(name, prefix);
      });
    });
    it('should throw an exception for non-string prefix', () => {
      const name = 'name';
      const prefix = true;
      assert.throws(() => {
        new HeaderMatcher(name, prefix);
      });
    });
  });
  describe('#doesHeaderMatch()', () => {
    const testCases = [
      {
        constructorParams: {
          name: 'Authorization',
          prefix: 'Token ',
        },
        header: {
          name: 'Authorization',
          value: 'Token 1234',
        },
        description: 'should return true for the same name and value, starting with prefix',
        result: true,
      },
      {
        constructorParams: {
          name: 'Authorization',
          prefix: 'Token',
        },
        header: {
          name: 'Auth',
          value: 'Token',
        },
        description: 'should return false for a different name',
        result: false,
      },
      {
        constructorParams: {
          name: 'Authorization',
          prefix: 'Token',
        },
        header: {
          name: 'Authorization',
          value: 'Bearer',
        },
        description: 'should return false for the same and value, not starting with prefix',
        result: false,
      },
      {
        constructorParams: {
          name: 'true',
          prefix: 'true',
        },
        header: {
          name: true,
          value: 'true',
        },
        description: 'should throw an exception for non-string name',
        exception: true,
      },
      {
        constructorParams: {
          name: 'auth',
          prefix: 'random_prefix',
        },
        header: {
          name: 'auth',
          value: {
            startsWith: () => true,
          },
        },
        description: 'should throw an exception for non-string value',
        exception: true,
      },
    ];
    testCases.forEach((testCase) => {
      it(testCase.description, () => {
        const matcher = new HeaderMatcher(
          testCase.constructorParams.name, testCase.constructorParams.prefix,
        );
        if (testCase.exception === true) {
          assert.throws(() => {
            matcher.doesHeaderMatch(testCase.header.name, testCase.header.value);
          });
        } else {
          const result = matcher.doesHeaderMatch(testCase.header.name, testCase.header.value);
          assert.strictEqual(result, testCase.result);
        }
      });
    });
  });
  describe('#fetchPayload()', () => {
    it('should get "test" for "Token test" and "Token " prefix', () => {
      const matcher = new HeaderMatcher('name', 'Token ');
      const payload = matcher.fetchPayload('name', 'Token test');
      assert.strictEqual(payload, 'test');
    });
    it('should throw an exception for header with wrong name', () => {
      const matcher = new HeaderMatcher('one', 'Token ');
      assert.throws(() => {
        matcher.fetchPayload('other', 'Token test');
      });
    });
  });
});
