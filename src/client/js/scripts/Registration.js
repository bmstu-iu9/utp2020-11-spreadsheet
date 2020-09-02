import FormatError from '../../../lib/errors/FormatError.js';

export default class Registration {
  constructor(form, resultHolder) {
    this.form = form;
    this.formData = new FormData(form);
    this.resultHolder = resultHolder;
  }

  register(request) {
    try {
      this.validateData();
      request.send(this.getUsername(), this.getPassword());
    } catch (e) {
      this.errorHandler(e);
    }
  }

  errorHandler(error) {
    if (error.name === 'FormatError' || error.message === 'Wrong second password') {
      this.resultHolder.textContent = 'Два пароля не совпадают';
    } else if (error.name === 'FormatError') {
      this.resultHolder.textContent = 'Некорректный формат данных';
    } else if (error.name === 'ConflictError') {
      this.resultHolder.textContent = 'Логин уже занят';
    }
    this.resultHolder.classList.remove('hide');
    console.log(' show');
  }

  getUsername() {
    if (this.formData.has('username')) {
      console.log(this.formData.get('username'), ' :username');
      return this.formData.get('username');
    }
    console.log('empty username');
    return undefined;
  }

  getPassword() {
    if (this.formData.has('password')) {
      return this.formData.get('password');
    }
    return undefined;
  }

  validateData() {
    if (this.getPassword() !== this.formData.get('repeat-password')) {
      throw new FormatError('Wrong second password');
    }
  }
}
