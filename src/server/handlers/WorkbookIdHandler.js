import fs from 'fs';
import EndpointHandler from './EndpointHandler.js';
import CommitFinder from '../../lib/synchronization/CommitFinder.js';
import { Synchronizer } from '../../lib/synchronization/Synchronizer.js';
import WorkbookIdSerializer from '../../lib/serialization/WorkbookIdSerializer.js';
import WorkbookId from '../../lib/spreadsheets/WorkbookId.js';

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
    const workbook = this.saveSystem.workbookLoader.load(id);
    const commits = this.saveSystem.commitLoader.load(id);
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
    this.saveSystem.commitSaver.save(id, synchronizer.acceptedCommits);
    this.saveSystem.workbookSaver.save(id, synchronizer.workbook);
    return res.sendStatus(200);
  }

  delete(req, res) {
    const validationResult = this.validateAccess(req, res);
    if (validationResult !== true) {
      return validationResult;
    }
    const id = Number.parseInt(req.params.id, 10);
    this.dataRepo.workbookRepo.delete(id);
    const path = this.saveSystem.workbookPathGenerator.generate(id);
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
    const workbook = this.saveSystem.workbookLoader.load(id);
    const commits = this.saveSystem.commitLoader.load(id);
    const lastCommitId = commits[commits.length - 1].ID;
    const workbookId = new WorkbookId(workbook, id, lastCommitId);
    const serialized = WorkbookIdSerializer.serialize(workbookId);
    return res.status(200).json(serialized);
  }

  getCommits(req, res) {
    const id = Number.parseInt(req.params.id, 10);
    const commits = this.saveSystem.commitLoader.load(id);
    const finder = new CommitFinder(commits);
    const afterPosition = finder.find(req.query.after);
    if (afterPosition === -1) {
      return res.sendStatus(409);
    }
    return res.status(200).json(commits.slice(afterPosition + 1));
  }
}
