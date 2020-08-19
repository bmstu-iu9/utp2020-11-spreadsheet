import WorkbookModel from '../database/WorkbookModel.js';
import { zeroID } from '../../lib/synchronization/Synchronizer.js';
import EndpointHandler from './EndpointHandler.js';
import WorkbookDeserializer from '../../lib/serialization/WorkbookDeserializer.js';
import WorkbookIdSerializer from '../../lib/serialization/WorkbookIdSerializer.js';

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
      const workbook = this.saveSystem.workbookLoader.load(wbModel.id);
      const commits = this.saveSystem.commitLoader.load(wbModel.id);
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
    this.saveSystem.workbookSaver.save(deserialized, id);
    this.saveSystem.commitSaver.save(id, [{ ID: zeroID }]);
    const workbookId = WorkbookIdSerializer.serialize(deserialized, id, zeroID);
    return res.status(200).send(workbookId);
  }
}
