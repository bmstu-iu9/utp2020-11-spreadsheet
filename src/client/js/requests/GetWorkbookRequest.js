import Request from './Request.js';
import WorkbookIdDeserializer from '../../../lib/serialization/WorkbookIdDeserializer.js';
import PersonalPageResultHandler from '../scripts/PersonalPageResultHandler.js';

export default class GetWorkbookRequest extends Request {
  send(handler) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${this.baseUrl}/workbook`);
    this.authorizer.authorize(xhr);
    xhr.send();
    xhr.onload = () => {
      try {
        GetWorkbookRequest.validateStatusCode(xhr.status);
        const list = JSON.parse(xhr.response)
          .map((serialized) => WorkbookIdDeserializer.deserialize(serialized));
        PersonalPageResultHandler.getBookListResultHandler(list);
      } catch (e) {
        if (handler !== undefined) {
          PersonalPageResultHandler.getBookListErrorHandler(e);
        }
      }
    };
  }
}
