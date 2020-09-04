import FormatError from '../../../lib/errors/FormatError.js';
import ConflictError from '../../../lib/errors/ConflictError.js';
import WrongSecondPasswordError from '../../../lib/errors/WrongSecondPasswordError.js';
import ForbiddenError from '../../../lib/errors/ForbiddenError.js';

export default class RegisterPageErrorHandler {
  constructor(resultHolder) {
    this.resultHolder = resultHolder;
  }

  registerHandle(error) {
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

  authorizeHandle(error) {
    if (error instanceof ForbiddenError) {
      this.resultHolder.textContent = 'Неверный логин или пароль';
    } else {
      this.resultHolder.textContent = 'Неизвестная ошибка';
    }
    this.resultHolder.classList.remove('hide');
  }
}
