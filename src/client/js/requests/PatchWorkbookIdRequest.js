import Request from './Request.js';

export default class PatchWorkbookIdRequest extends Request {
  send(id, commits) {
    const xhr = new XMLHttpRequest();
    xhr.open('PATCH', `${this.baseUrl}/workbook/${id}`);
    this.authorizer.authorize(xhr);
    xhr.send(JSON.stringify(commits));
    switch (xhr.status) {
      case 409:
        return JSON.parse(xhr.response);
      default:
        PatchWorkbookIdRequest.validateStatusCode(xhr.status);
    }
    return [];
  }
}
