import EndpointHandler from './EndpointHandler.js';
import JsonConverter from '../../lib/readWorkbook/JsonConverter.js';

export default class WorkbookIdHandler extends EndpointHandler {
  get(req, res) {
    if (req.user === undefined) {
      res.sendStatus(401);
      return;
    }
    let workbook;
    try {
      workbook = this.dataRepo.workbookRepo.getById(req.params.id);
    } catch (error) {
      res.sendStatus(404);
      return;
    }
    const content = JsonConverter.readWorkbook(workbook.path);
    content.id = workbook.id;
    res.status(200).json(content);
  }
}
