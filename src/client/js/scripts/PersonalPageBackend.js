import Workbook from '../../../lib/spreadsheets/Workbook.js';
import PersonalPageResultHandler from './PersonalPageResultHandler.js';

export default class PersonalPageBackend {
  constructor(addForm) {
    this.addForm = addForm;
  }

  addBook(request, handler) {
    const formData = new FormData(this.addForm);
    try {
      const book = new Workbook(formData.get('name'));
      request.send(book, handler);
    } catch (e) {
      PersonalPageResultHandler.addBookErrorHandle(e);
    }
  }

  static getUsername() {
    const username = localStorage.getItem('username');
    if (username !== null) {
      return localStorage.getItem('username');
    }
    return 'RANDOM USERNAME';
  }

  static logout(registerPageURL) {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = registerPageURL;
  }

  static getBookList(request, handler) {
    try {
      request.send(handler);
    } catch (e) {
      PersonalPageResultHandler.getBookListErrorHandler(e);
    }
  }
}
