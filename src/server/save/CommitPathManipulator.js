import CommitPathGenerator from './CommitPathGenerator.js';

export default class CommitPathManipulator {
  constructor(commitPathGenerator) {
    this.setCommitPathGenerator(commitPathGenerator);
  }

  setCommitPathGenerator(commitPathGenerator) {
    if (!(commitPathGenerator instanceof CommitPathGenerator)) {
      throw new TypeError('commitPathGenerator must be a CommitPathGenerator instance');
    }
    this.commitPathGenerator = commitPathGenerator;
  }
}
