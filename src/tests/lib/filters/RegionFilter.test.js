import * as assert from 'assert';
import RegionFilter from '../../../lib/filters/RegionFilter.js';

describe('RegionFilter', () => {
  describe('#constructor()', () => {
    it('should not throw an exception for AB5, A7', () => {
      assert.doesNotThrow(() => {
        new RegionFilter('AB5', 'A7');
      });
    });
    it('should throw an exception for B5, 7A', () => {
      assert.throws(() => {
        new RegionFilter('B5', '7A');
      }, (err) => {
        assert.strictEqual(err.name, 'FormatError');
        return true;
      });
    });
    it('should throw an exception for 5B, A7', () => {
      assert.throws(() => {
        new RegionFilter('5B', '7A');
      }, (err) => {
        assert.strictEqual(err.name, 'FormatError');
        return true;
      });
    });
  });
  describe('#doesPositionMatch()', () => {
    const testCases = [{
      description: 'should return true for A4 in A3:A5',
      filter: ['A3', 'A5'],
      position: 'A4',
      result: true,
      exception: false,
    },
    {
      description: 'should return false for A6 in A3:A5',
      filter: ['A3', 'A5'],
      position: 'A6',
      result: false,
      exception: false,
    },
    {
      description: 'should return true for B5 in A1:C6',
      filter: ['A1', 'C6'],
      position: 'B5',
      result: true,
      exception: false,
    },
    {
      description: 'should return true for B5 in C6:A1',
      filter: ['C6', 'A1'],
      position: 'B5',
      result: true,
      exception: false,
    },
    {
      description: 'should return true for AA5 in A1:BBB8',
      filter: ['A1', 'BBB8'],
      position: 'AA5',
      result: true,
      exception: false,
    },
    {
      description: 'should throw an exception for position 7A',
      filter: ['B5', 'BC7'],
      position: '7A',
      exception: true,
    },
    {
      description: 'should throw an exception for position t5',
      filter: ['B5', 'BC7'],
      position: 't5',
      exception: true,
    },
    {
      description: 'should return false for A4 in B3:C5',
      filter: ['B3', 'C5'],
      position: 'A4',
      result: false,
      exception: false,
    },
    {
      description: 'should return false for A4 in AB3:C5',
      filter: ['AB3', 'C5'],
      position: 'A4',
      result: false,
      exception: false,
    },
    ];
    testCases.forEach((testCase) => {
      it(testCase.description, () => {
        const regionFilter = new RegionFilter(...testCase.filter);
        if (!testCase.exception) {
          const result = regionFilter.doesPositionMatch(testCase.position);
          assert.strictEqual(result, testCase.result);
        } else {
          assert.throws(() => {
            regionFilter.doesPositionMatch(testCase.position);
          }, (err) => {
            assert.strictEqual(err.name, 'FormatError');
            return true;
          });
        }
      });
    });
  });
});
