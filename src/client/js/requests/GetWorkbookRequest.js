import Request from './Request.js';
import UnauthorizedError from '../../../lib/errors/UnanuthorizedError.js';
import WorkbookIdDeserializer from '../../../lib/serialization/WorkbookIdDeserializer.js';

export default class GetWorkbookRequest extends Request {
  send() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${this.baseUrl}/workbook`);
    this.authorizer.authorize(xhr);
    xhr.send();
    if (xhr.status === 401) {
      throw new UnauthorizedError();
    }
    return JSON.parse(xhr.response)
      .map((serialized) => WorkbookIdDeserializer.deserialize(serialized));
  }
}
