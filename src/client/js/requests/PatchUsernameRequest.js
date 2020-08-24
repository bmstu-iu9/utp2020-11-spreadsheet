import Request from './Request.js';
import UserModel from '../../../server/database/UserModel.js';

export default class PatchUsernameRequest extends Request {
  send(username, isAdmin, password) {
    const xhr = new XMLHttpRequest();
    xhr.open('PATCH', `${this.baseUrl}/user/${username}`);
    this.authorizer.authorize(xhr);
    xhr.send(JSON.stringify({ isAdmin, password }));
    PatchUsernameRequest.validateStatusCode(xhr.status);
    return UserModel.fromJSONtoUser(JSON.parse(xhr.response));
  }
}
