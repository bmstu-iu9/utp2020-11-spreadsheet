import Request from './Request.js';
import UserModel from '../../../server/database/UserModel.js';

export default class GetUsernameRequest extends Request {
  send(username) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${this.baseUrl}/user/${username}`);
    this.authorizer.authorize(xhr);
    xhr.send();
    GetUsernameRequest.validateStatusCode(xhr.status);
    return UserModel.fromJSONtoUser(JSON.parse(xhr.response));
  }
}
