import fs from 'fs';
import EndpointHandler from './EndpointHandler.js';
import WorkbookLoader from '../save/WorkbookLoader.js';
import WorkbookPathGenerator from '../save/WorkbookPathGenerator.js';
import CommitLoader from '../save/CommitLoader.js';
import CommitPathGenerator from '../save/CommitPathGenerator.js';
import CommitFinder from '../synchronization/CommitFinder.js';

export default class WorkbookIdHandler extends EndpointHandler {
  get(req, res) {
    if (this.validateAccess(req, res)) {
      if (req.query.after === undefined) {
        this.getWorkbook(req, res);
      } else {
        this.getCommits(req, res);
      }
    }
  }

  delete(req, res) {
    const id = Number.parseInt(req.params.id, 10);
    if (this.validateAccess(req, res)) {
      this.dataRepo.workbookRepo.delete(id);
      const generator = new WorkbookPathGenerator(this.config.pathToWorkbooks);
      const path = generator.generate(id);
      fs.unlinkSync(path);
      res.sendStatus(200);
    }
  }

  validateAccess(req, res) {
    const id = Number.parseInt(req.params.id, 10);
    if (req.user === undefined) {
      res.sendStatus(401);
      return false;
    }
    let workbook;
    try {
      workbook = this.dataRepo.workbookRepo.getById(id);
    } catch {
      res.sendStatus(404);
      return false;
    }
    if (workbook.login !== req.user.login) {
      res.sendStatus(403);
      return false;
    }
    return true;
  }

  getWorkbook(req, res) {
    const id = Number.parseInt(req.params.id, 10);
    const pathGenerator = new WorkbookPathGenerator(this.config.pathToWorkbooks);
    const loader = new WorkbookLoader(pathGenerator);
    let content;
    try {
      content = loader.load(id);
    } catch {
      res.sendStatus(404);
      return;
    }
    content.id = id;
    res.status(200).json(content);
  }

  getCommits(req, res) {
    const id = Number.parseInt(req.params.id, 10);
    const pathGenerator = new CommitPathGenerator(this.config.pathToCommits);
    const loader = new CommitLoader(pathGenerator);
    let commits;
    try {
      commits = loader.load(id);
    } catch {
      res.sendStatus(404);
      return;
    }
    const finder = new CommitFinder(commits);
    const afterPosition = finder.find(req.query.after);
    if (afterPosition === -1) {
      res.sendStatus(409);
      return;
    }
    res.status(200).json(commits.slice(afterPosition + 1));
  }
}
