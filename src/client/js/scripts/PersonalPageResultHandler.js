import FormatError from '../../../lib/errors/FormatError.js';
import UnauthorizedError from '../../../lib/errors/UnanuthorizedError.js';

export default class PersonalPageResultHandler {
  constructor(workspacePageUrl, registerPageURL) {
    this.workspacePageUrl = workspacePageUrl;
    this.registerPageURL = registerPageURL;
  }

  addBookResultHandle(workbook) {
    localStorage.setItem('bookName', workbook.name);
    window.location.href = this.workspacePageUrl;
  }

  static addBookErrorHandle(e) {
    if (e instanceof FormatError) {
      alert('Неверный формат данных');
      return;
    }
    if (e instanceof UnauthorizedError) {
      alert('Вы не авторизированны');
      return;
    }
    alert('Неизвестная ошибка');
  }

  authErrorHandle(e) {
    if (e instanceof TypeError) {
      alert('Вы не авторизированны');
      window.location.href = this.registerPageURL;
    }
  }

  static getBookListResultHandler(list) {
    const template = document.querySelector('#book-icon-template');
    const name = template.content.querySelector('#book-name');
    const listPlace = document.getElementById('person-book-list');
    list.forEach((book) => {
      name.textContent = book.workbook.name;
      listPlace.appendChild(document.importNode(template.content, true));
    });
  }

  static getBookListErrorHandler(e) {
    // todo
  }
}
