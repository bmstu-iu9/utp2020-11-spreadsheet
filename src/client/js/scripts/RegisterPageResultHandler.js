import FormatError from '../../../lib/errors/FormatError.js';
import ConflictError from '../../../lib/errors/ConflictError.js';
import WrongSecondPasswordError from '../../../lib/errors/WrongSecondPasswordError.js';
import ForbiddenError from '../../../lib/errors/ForbiddenError.js';

export default class RegisterPageResultHandler {
  constructor(resultHolder, accountPageURL) {
    this.resultHolder = resultHolder;
    this.accountPageURL = accountPageURL;
  }

  registerErrorHandle(error) {
    if (error instanceof WrongSecondPasswordError) {
      this.resultHolder.textContent = 'Два пароля не совпадают';
    } else if (error instanceof FormatError) {
      this.resultHolder.textContent = 'Некорректный формат данных';
    } else if (error instanceof ConflictError) {
      this.resultHolder.textContent = 'Логин уже занят';
    } else {
      this.resultHolder.textContent = 'Неизвестная ошибка';
    }
    this.resultHolder.classList.remove('hide');
  }

  registerResultHandle() {
    this.resultHolder.textContent = 'Вы успешно зарегистрированы';
    this.resultHolder.classList.remove('hide');
  }

  authorizeErrorHandle(error) {
    if (error instanceof ForbiddenError) {
      this.resultHolder.textContent = 'Неверный логин или пароль';
    } else {
      this.resultHolder.textContent = 'Неизвестная ошибка';
    }
    this.resultHolder.classList.remove('hide');
  }

  authorizeResultHandle(username, token) {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    window.location.href = this.accountPageURL;
  }
}
