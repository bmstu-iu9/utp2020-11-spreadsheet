import fs from 'fs';
import EndpointHandler from './EndpointHandler.js';
import WorkbookLoader from '../save/WorkbookLoader.js';
import WorkbookPathGenerator from '../save/WorkbookPathGenerator.js';
import CommitLoader from '../save/CommitLoader.js';
import CommitPathGenerator from '../save/CommitPathGenerator.js';
import CommitFinder from '../../lib/synchronization/CommitFinder.js';
import { Synchronizer } from '../../lib/synchronization/Synchronizer.js';
import WorkbookSaver from '../save/WorkbookSaver.js';
import CommitSaver from '../save/CommitSaver.js';

export default class WorkbookIdHandler extends EndpointHandler {
  get(req, res) {
    const validationResult = this.validateAccess(req, res);
    if (validationResult !== true) {
      return validationResult;
    }
    if (req.query.after === undefined) {
      return this.getWorkbook(req, res);
    }
    return this.getCommits(req, res);
  }

  patch(req, res) {
    const validationResult = this.validateAccess(req, res);
    if (validationResult !== true) {
      return validationResult;
    }
    const id = Number.parseInt(req.params.id, 10);
    const workbook = this.fetchWorkbook(id);
    const commits = this.fetchCommits(id);
    const synchronizer = new Synchronizer(workbook, commits);
    let conflicts;
    try {
      conflicts = synchronizer.addCommits(
        req.body.changes,
        req.body.lastSynchronizedCommit,
      );
    } catch {
      return res.sendStatus(400);
    }
    if (conflicts.length !== 0) {
      return res.status(409).json(conflicts);
    }
    this.saveCommits(synchronizer.acceptedCommits);
    this.saveWorkbook(synchronizer.workbook);
    return res.sendStatus(200);
  }

  saveCommits(commits) {
    const generator = new CommitPathGenerator(this.config.pathToCommits);
    const saver = new CommitSaver(generator);
    saver.save(1, commits);
  }

  saveWorkbook(workbook) {
    const generator = new WorkbookPathGenerator(this.config.pathToWorkbooks);
    const saver = new WorkbookSaver(generator);
    saver.save(workbook, 1);
  }

  delete(req, res) {
    const validationResult = this.validateAccess(req, res);
    if (validationResult !== true) {
      return validationResult;
    }
    const id = Number.parseInt(req.params.id, 10);
    this.dataRepo.workbookRepo.delete(id);
    const generator = new WorkbookPathGenerator(this.config.pathToWorkbooks);
    const path = generator.generate(id);
    fs.unlinkSync(path);
    return res.sendStatus(200);
  }

  validateAccess(req, res) {
    const id = Number.parseInt(req.params.id, 10);
    if (req.user === undefined) {
      return res.sendStatus(401);
    }
    let workbook;
    try {
      workbook = this.dataRepo.workbookRepo.getById(id);
    } catch {
      return res.sendStatus(404);
    }
    if (workbook.login !== req.user.login) {
      return res.sendStatus(403);
    }
    return true;
  }

  getWorkbook(req, res) {
    const id = Number.parseInt(req.params.id, 10);
    const content = this.fetchWorkbook(id);
    if (content === undefined) {
      return res.sendStatus(404);
    }
    content.id = id;
    return res.status(200).json(content);
  }

  getCommits(req, res) {
    const id = Number.parseInt(req.params.id, 10);
    const commits = this.fetchCommits(id);
    if (commits === undefined) {
      return res.sendStatus(404);
    }
    const finder = new CommitFinder(commits);
    const afterPosition = finder.find(req.query.after);
    if (afterPosition === -1) {
      return res.sendStatus(409);
    }
    return res.status(200).json(commits.slice(afterPosition + 1));
  }

  fetchWorkbook(id) {
    const pathGenerator = new WorkbookPathGenerator(this.config.pathToWorkbooks);
    const loader = new WorkbookLoader(pathGenerator);
    return WorkbookIdHandler.fetchWithLoader(loader, id);
  }

  fetchCommits(id) {
    const pathGenerator = new CommitPathGenerator(this.config.pathToCommits);
    const loader = new CommitLoader(pathGenerator);
    return WorkbookIdHandler.fetchWithLoader(loader, id);
  }

  static fetchWithLoader(loader, id) {
    let content;
    try {
      content = loader.load(id);
    } catch {
      return undefined;
    }
    return content;
  }
}
