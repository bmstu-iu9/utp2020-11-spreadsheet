import Request from './Request.js';
import WorkbookIdDeserializer from '../../../lib/serialization/WorkbookIdDeserializer.js';

export default class GetWorkbookIdRequest extends Request {
  send(id, after) {
    const xhr = new XMLHttpRequest();
    if (after === undefined) {
      xhr.open('GET', `${this.baseUrl}/workbook/${id}`);
    } else {
      xhr.open('GET', `${this.baseUrl}/workbook/${id}?after=${after}`);
    }
    this.authorizer.authorize(xhr);
    xhr.send();
    GetWorkbookIdRequest.validateStatusCode(xhr.status);
    const response = JSON.parse(xhr.response);
    if (after === undefined) {
      return WorkbookIdDeserializer.deserialize(response);
    }
    return response;
  }
}
