import Workbook from '../../../lib/spreadsheets/Workbook.js';

export default class PersonalPageBackend {
  constructor(addForm) {
    this.addForm = addForm;
  }

  addBook(request, handler) {
    const formData = new FormData(this.addForm);
    const book = new Workbook(formData.get('name'));
    request.send(book, handler);
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

  setBooks() {
    // получаем книги и заполняем инфу в html
  }

  onBookClick(id) {
    // просто редиректим на страницу пространства с названием книги в local data...
  }
}
