import Request from './Request.js';

export default class PostUserRequest extends Request {
  send(username, password, handler) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${this.baseUrl}/user`);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify({ password, username }));
    xhr.onload = () => {
      try {
        PostUserRequest.validateStatusCode(xhr.status);
        handler.registerResultHandle();
      } catch (e) {
        if (handler !== undefined) {
          handler.registerErrorHandle(e);
        }
      }
    };
  }
}
