export default class WorkbookPageBackend {
  addBook(request) {
  // всплывает форма, я получаю инфу с неё и добавляю
  // при успехе убираю форму и направляю на страницу с книгой, при неудаче ....

  }

  static getUsername() {
    return localStorage.getItem('username');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    // перекинуть на страницу регистрации
  }

  setBooks() {
    // получаем книги и заполняем инфу в html
  }

  onBookClick(id) {
    // просто редиректим на страницу пространства с названием книги в local data...
  }
}
