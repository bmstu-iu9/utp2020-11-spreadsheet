import WorkbookModel from '../database/WorkbookModel.js';
import { zeroID } from '../../lib/synchronization/Synchronizer.js';
import EndpointHandler from './EndpointHandler.js';
import WorkbookLoader from '../save/WorkbookLoader.js';
import WorkbookSaver from '../save/WorkbookSaver.js';
import WorkbookDeserializer from '../../lib/serialization/WorkbookDeserializer.js';
import WorkbookPathGenerator from '../save/WorkbookPathGenerator.js';
import CommitPathGenerator from '../save/CommitPathGenerator.js';
import CommitSaver from '../save/CommitSaver.js';
import WorkbookIdSerializer from '../../lib/serialization/WorkbookIdSerializer.js';
import CommitLoader from '../save/CommitLoader.js';

export default class WorkbookHandler extends EndpointHandler {
  get(req, res) {
    if (req.user === undefined) {
      return res.sendStatus(401);
    }
    let list;
    try {
      list = this.dataRepo.workbookRepo.getByLogin(req.user.login);
    } catch (error) {
      return res.sendStatus(404);
    }
    const result = [];
    list.forEach((wbModel) => {
      const pathGenerator = new WorkbookPathGenerator(this.config.pathToWorkbooks);
      const loader = new WorkbookLoader(pathGenerator);
      const workbook = loader.load(wbModel.id);
      const commitPathGenerator = new CommitPathGenerator(this.config.pathToWorkbooks);
      const commitLoader = new CommitLoader(commitPathGenerator);
      const commits = commitLoader.load(wbModel.id);
      const lastCommitId = commits[commits.length - 1].ID;
      const serialized = WorkbookIdSerializer.serialize(workbook, wbModel.id, lastCommitId);
      result.push(serialized);
    });
    return res.status(200).send(result);
  }

  post(req, res) {
    if (req.user === undefined) {
      return res.sendStatus(401);
    }
    if (req.body === undefined) {
      return res.sendStatus(400);
    }
    const deserialized = WorkbookDeserializer.deserialize(req.body);
    const workbookModel = new WorkbookModel(req.user.login);
    const id = this.dataRepo.workbookRepo.save(workbookModel);
    const workbookPathGenerator = new WorkbookPathGenerator(this.config.pathToWorkbooks);
    const workbookSaver = new WorkbookSaver(workbookPathGenerator);
    workbookSaver.save(deserialized, id);
    const commitPathGenerator = new CommitPathGenerator(this.config.pathToCommits);
    const commitSaver = new CommitSaver(commitPathGenerator);
    commitSaver.save(id, [{ ID: zeroID }]);
    const workbookId = WorkbookIdSerializer.serialize(deserialized, id, zeroID);
    return res.status(200).send(workbookId);
  }
}
