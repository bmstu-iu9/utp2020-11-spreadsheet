export default class CommitPathGenerator {
  constructor(pathToCommits) {
    this.setPathToCommits(pathToCommits);
  }

  setPathToCommits(pathToCommits) {
    if (typeof pathToCommits !== 'string') {
      throw new TypeError('pathToCommits must be a string');
    }
    this.pathToCommits = pathToCommits;
  }

  generate(workbookId) {
    return `${this.pathToCommits}/${workbookId}.commits.json`;
  }
}
