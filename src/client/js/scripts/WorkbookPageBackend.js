export default class WorkbookPageBackend {
  addBook(request) {
  // всплывает форма, я получаю инфу с неё и добавляю
  // при успехе убираю форму и направляю на страницу с книгой, при неудаче ....

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
