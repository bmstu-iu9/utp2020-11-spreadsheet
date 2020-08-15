import * as assert from 'assert';
import mock from 'mock-fs';
import fs from 'fs';
import CommitPathGenerator from '../../../server/save/CommitPathGenerator.js';
import CommitSaver from '../../../server/save/CommitSaver.js';

describe('CommitSaver', () => {
  const generator = new CommitPathGenerator('commits');
  const saver = new CommitSaver(generator);

  describe('#constructor()', () => {
    it('should create object with correct fields', () => {
      assert.strictEqual(saver.commitPathGenerator, generator);
    });
    it('should throw an exception for non-generator', () => {
      assert.throws(() => {
        new CommitSaver({});
      }, TypeError);
    });
  });
  describe('#save()', () => {
    it('should save commits to commits/1.commits.json', () => {
      mock({
        commits: {
          '1.commmits.json': '',
        },
      });
      const commits = [{ID:1}];
      saver.save(1, commits);
      const content = fs.readFileSync('commits/1.commits.json');
      const testCommits = JSON.parse(content);
      assert.deepStrictEqual(testCommits, commits);
      mock.restore();
    });
    it('should throw an exception for non-integer Id', () => {
      assert.throws(() => {
        saver.save(1.2, []);
      }, TypeError);
    });
    it('should throw an exception for non-array', () => {
      assert.throws(() => {
        saver.save(1, {});
      }, TypeError);
    });
  });
});
