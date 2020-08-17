export default class CommitFinder {
  constructor(commits) {
    this.setCommits(commits);
  }

  setCommits(commits) {
    if (!(commits instanceof Array)) {
      throw new TypeError('commits must be an array');
    }
    this.commits = commits;
  }

  find(id) {
    return this.commits.findIndex((value) => value.ID === id);
  }
}
