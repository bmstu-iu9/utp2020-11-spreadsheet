import Request from './Request.js';
import UserModel from '../../../server/database/UserModel.js';

export default class GetUserRequest extends Request {
  send() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${this.baseUrl}/user`);
    this.authorizer.authorize(xhr);
    xhr.send();
    GetUserRequest.validateStatusCode(xhr.status);
    return UserModel.fromJSONtoUsers(JSON.parse(xhr.response));
  }
}
