import * as assert from 'assert';
import CommitPathGenerator from '../../../server/save/CommitPathGenerator.js';

describe('CommitPathGenerator', () => {
  describe('#constructor()', () => {
    it('should create object with correct fields', () => {
      const pathToCommits = './commits';
      const generator = new CommitPathGenerator(pathToCommits);
      assert.strictEqual(pathToCommits, generator.pathToCommits);
    });
    it('should throw an exception for non-string path', () => {
      assert.throws(() => {
        new CommitPathGenerator(4);
      }, TypeError);
    });
  });
  describe('#generate()', () => {
    it('should return commits/1.commits.json', () => {
      const generator = new CommitPathGenerator('commits');
      const path = generator.generate(1);
      assert.strictEqual(path, 'commits/1.commits.json');
    });
  });
});
