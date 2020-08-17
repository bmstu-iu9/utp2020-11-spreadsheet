import * as assert from 'assert';
import CommitFinder from '../../../lib/synchronization/CommitFinder.js';

describe('CommitFinder', () => {
  const commits = [
    {
      ID: '15cd5f9b-11e7-4a20-af63-419327b7e4d8',
    },
    {
      ID: '9fa85623-7faf-41b8-a623-d65641d3e7f4',
    },
  ];
  const finder = new CommitFinder(commits);

  describe('#constructor()', () => {
    it('should set commits', () => {
      const testFinder = new CommitFinder(commits);
      assert.strictEqual(commits, testFinder.commits);
    });
    it('should throw an exception for non-array commits', () => {
      assert.throws(() => {
        new CommitFinder({});
      }, TypeError);
    });
  });
  describe('#find()', () => {
    it('should return 1', () => {
      const result = finder.find(commits[1].ID);
      assert.strictEqual(result, 1);
    });
  });
});
