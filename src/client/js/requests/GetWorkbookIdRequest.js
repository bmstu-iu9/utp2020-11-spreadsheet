import Request from './Request.js';
import WorkbookIdDeserializer from '../../../lib/serialization/WorkbookIdDeserializer.js';

export default class GetWorkbookIdRequest extends Request {
  send(id) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${this.baseUrl}/workbook/${id}`);
    this.authorizer.authorize(xhr);
    xhr.send();
    GetWorkbookIdRequest.validateStatusCode(xhr.status);
    const response = JSON.parse(xhr.response);
    return WorkbookIdDeserializer.deserialize(response);
  }
}
