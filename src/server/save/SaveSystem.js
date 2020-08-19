import CommitLoader from './CommitLoader.js';
import CommitSaver from './CommitSaver.js';
import CommitPathGenerator from './CommitPathGenerator.js';
import WorkbookPathGenerator from './WorkbookPathGenerator.js';
import WorkbookLoader from './WorkbookLoader.js';
import WorkbookSaver from './WorkbookSaver.js';

export default class SaveSystem {
  constructor(pathToWorkbooks, pathToCommits) {
    this.instantiateWorkbookSubsystem(pathToWorkbooks);
    this.instantiateCommitSubsystem(pathToCommits);
  }

  instantiateCommitSubsystem(pathToCommits) {
    const commitPathGenerator = new CommitPathGenerator(pathToCommits);
    this.commitLoader = new CommitLoader(commitPathGenerator);
    this.commitSaver = new CommitSaver(commitPathGenerator);
  }

  instantiateWorkbookSubsystem(pathToWorkbooks) {
    const workbookPathGenerator = new WorkbookPathGenerator(pathToWorkbooks);
    this.workbookLoader = new WorkbookLoader(workbookPathGenerator);
    this.workbookSaver = new WorkbookSaver(workbookPathGenerator);
  }
}
