import fs from 'fs';
import EndpointHandler from './EndpointHandler.js';
import WorkbookLoader from '../save/WorkbookLoader.js';
import WorkbookPathGenerator from '../save/WorkbookPathGenerator.js';

export default class WorkbookIdHandler extends EndpointHandler {
  get(req, res) {
    return this.getWorkbook(req, res);
  }

  getWorkbook(req, res) {
    const id = Number.parseInt(req.params.id, 10);
    if (req.user === undefined) {
      res.sendStatus(401);
      return;
    }
    let workbook;
    try {
      workbook = this.dataRepo.workbookRepo.getById(id);
    } catch {
      res.sendStatus(404);
      return;
    }
    if (workbook.login !== req.user.login) {
      res.sendStatus(403);
      return;
    }
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

  delete(req, res) {
    const id = Number.parseInt(req.params.id, 10);
    if (req.user === undefined) {
      return res.sendStatus(401);
    }
    let workbook;
    try {
      workbook = this.dataRepo.workbookRepo.getById(id);
    } catch (error) {
      return res.sendStatus(404);
    }
    if (req.user.login !== workbook.login) {
      return res.sendStatus(403);
    }
    this.dataRepo.workbookRepo.delete(id);
    const generator = new WorkbookPathGenerator(this.config.pathToWorkbooks);
    const path = generator.generate(id);
    fs.unlinkSync(path);
    return res.sendStatus(200);
  }
}
