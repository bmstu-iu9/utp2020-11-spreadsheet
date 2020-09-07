import Request from './Request.js';

export default class PostAuthRequest extends Request {
  send(username, password, handler) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${this.baseUrl}/auth`);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify({ password, username }));
    xhr.onload = () => {
      try {
        PostAuthRequest.validateStatusCode(xhr.status);
        const parsed = JSON.parse(xhr.response);
        handler.authorizeResultHandle(username, parsed.token);
      } catch (e) {
        if (handler !== undefined) {
          handler.authorizeErrorHandle(e);
        }
      }
    };
  }
}
