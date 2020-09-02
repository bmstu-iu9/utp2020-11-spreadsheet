import Request from './Request.js';
import UserModel from '../../../server/database/UserModel.js';

export default class PostUserRequest extends Request {
  send(username, password) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${this.baseUrl}/user`);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify({ password, username }));
    xhr.onload = () => {
      PostUserRequest.validateStatusCode(xhr.status);
      const parsed = JSON.parse(xhr.response);
      return UserModel.fromJSONtoUser(parsed);
    };
  }
}
