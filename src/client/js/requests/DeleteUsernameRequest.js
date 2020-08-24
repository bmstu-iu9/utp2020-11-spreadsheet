import Request from './Request.js';

export default class DeleteUsernameRequest extends Request {
  send(username) {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `${this.baseUrl}/user/${username}`);
    this.authorizer.authorize(xhr);
    xhr.send();
    DeleteUsernameRequest.validateStatusCode(xhr.status);
  }
}
