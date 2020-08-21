import Request from './Request.js';

export default class DeleteWorkbookIdRequest extends Request {
  send(id) {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `${this.baseUrl}/workbook/${id}`);
    xhr.send();
    DeleteWorkbookIdRequest.validateStatusCode(xhr.status);
  }
}
