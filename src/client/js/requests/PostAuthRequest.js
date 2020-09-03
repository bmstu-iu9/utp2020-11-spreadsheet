import Request from './Request.js';
import TokenModel from '../../../server/database/TokenModel.js';

export default class PostUserRequest extends Request {
  send(username, password) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${this.baseUrl}/auth`);
    xhr.send(JSON.stringify({ password, username }));
    PostUserRequest.validateStatusCode(xhr.status);
    const parsed = JSON.parse(xhr.response);
    return new TokenModel(username, parsed.token);
  }
}
