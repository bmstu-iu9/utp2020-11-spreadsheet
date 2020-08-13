import * as assert from 'assert';
import UuidValidator from '../../../lib/uuid/UuidValidator.js';

describe('UuidValidator', () => {
  describe('#isUuidValid()', () => {
    const testCases = [
      {
        uuid: 'efe926c9-b247-4768-a185-9de4cfc58012',
        expected: true,
      },
      {
        uuid: '74b5077d-6dca-4d69-876f-22dafe6440be',
        expected: true,
      },
      {
        uuid: '74b5077d-6dca-4d69-876f-22dafe6440b',
        expected: false,
      },
      {
        uuid: '74b5077d-6dca-4d69-876f-22dafe6440bee',
        expected: false,
      },
    ];
    testCases.forEach((testCase) => {
      const description = `should return ${testCase.expected} for ${testCase.uuid}`;
      it(description, () => {
        assert.strictEqual(UuidValidator.isUuidValid(testCase.uuid), testCase.expected);
      });
    });
  });
});
