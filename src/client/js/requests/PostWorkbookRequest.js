import Request from './Request.js';
import WorkbookIdDeserializer from '../../../lib/serialization/WorkbookIdDeserializer.js';
import WorkbookSerializer from '../../../lib/serialization/WorkbookSerializer.js';

export default class PostWorkbookRequest extends Request {
  send(workbook) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${this.baseUrl}/workbook`);
    this.authorizer.authorize(xhr);
    const serialized = WorkbookSerializer.serialize(workbook);
    xhr.send(JSON.stringify(serialized));
    PostWorkbookRequest.validateStatusCode(xhr.status);
    const parsed = JSON.parse(xhr.response);
    return WorkbookIdDeserializer.deserialize(parsed);
  }
}
