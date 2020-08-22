import Request from './Request.js';

export default class DeleteWorkbookIdRequest extends Request {
  send(id) {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `${this.baseUrl}/workbook/${id}`);
    this.authorizer.authorize(xhr);
    xhr.send();
    DeleteWorkbookIdRequest.validateStatusCode(xhr.status);
  }
}
