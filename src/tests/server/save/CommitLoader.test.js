import * as assert from 'assert';
import mock from 'mock-fs';
import CommitPathLoader from '../../../server/save/CommitLoader.js';
import CommitPathSaver from '../../../server/save/CommitSaver.js';
import CommitPathGenerator from '../../../server/save/CommitPathGenerator.js';

describe('CommitLoader', () => {
  const generator = new CommitPathGenerator('commits');
  const loader = new CommitPathLoader(generator);

  describe('#load()', () => {
    it('should return saved object', () => {
      mock({
        commits: {
          '322.commits.json': '',
        },
      });
      const saver = new CommitPathSaver(generator);
      const commits = [
        {
          ID: 1,
        },
      ];
      saver.save(322, commits);
      const testCommits = loader.load(322);
      assert.deepStrictEqual(testCommits, commits);
    });
    it('should throw an exception for non-integer', () => {
      assert.throws(() => {
        loader.load(3.22);
      }, TypeError);
    });
  });
});
