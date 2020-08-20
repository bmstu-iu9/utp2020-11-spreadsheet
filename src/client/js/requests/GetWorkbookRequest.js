import Request from './Request.js';

export default class GetWorkbookRequest extends Request {
  send() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${this.baseUrl}/workbook`);
    this.authorizer.authorize(xhr);
    xhr.send();
    return JSON.parse(xhr.response);
  }
}
