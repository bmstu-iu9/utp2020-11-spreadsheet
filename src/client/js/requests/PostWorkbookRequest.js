import Request from './Request.js';
import WorkbookSerializer from '../../../lib/serialization/WorkbookSerializer.js';
import PersonalPageResultHandler from '../scripts/PersonalPageResultHandler.js';

export default class PostWorkbookRequest extends Request {
  send(workbook, handler) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${this.baseUrl}/workbook`);
    this.authorizer.authorize(xhr);
    xhr.setRequestHeader('Content-type', 'application/json');
    const serialized = WorkbookSerializer.serialize(workbook);
    xhr.send(JSON.stringify(serialized));
    xhr.onload = () => {
      try {
        PostWorkbookRequest.validateStatusCode(xhr.status);
        handler.addBookResultHandle(workbook);
      } catch (e) {
        if (handler !== undefined) {
          PersonalPageResultHandler.addBookErrorHandle(e);
        }
      }
    };
  }
}
