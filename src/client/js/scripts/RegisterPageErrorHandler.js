export default class RegisterPageErrorHandler {
  constructor(resultHolder) {
    this.resultHolder = resultHolder;
  }

  registerHandle(error) {
    if (error.name === 'FormatError' && error.message === 'Wrong second password') {
      this.resultHolder.textContent = 'Два пароля не совпадают';
    } else if (error.name === 'FormatError') {
      this.resultHolder.textContent = 'Некорректный формат данных';
    } else if (error.name === 'ConflictError') {
      this.resultHolder.textContent = 'Логин уже занят';
    } else {
      this.resultHolder.textContent = 'Неизвестная ошибка';
    }
    this.resultHolder.classList.remove('hide');
  }
}
