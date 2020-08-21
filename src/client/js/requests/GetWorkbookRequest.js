import Request from './Request.js';
import WorkbookIdDeserializer from '../../../lib/serialization/WorkbookIdDeserializer.js';

export default class GetWorkbookRequest extends Request {
  send() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${this.baseUrl}/workbook`);
    this.authorizer.authorize(xhr);
    xhr.send();
    Request.validateStatusCode(xhr.status);
    return JSON.parse(xhr.response)
      .map((serialized) => WorkbookIdDeserializer.deserialize(serialized));
  }
}
