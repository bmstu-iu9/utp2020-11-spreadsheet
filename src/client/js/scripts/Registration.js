import FormatError from '../../../lib/errors/FormatError.js';
import ConflictError from '../../../lib/errors/ConflictError.js';

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
    if (error === FormatError) {
      this.resultHolder.textContent = 'Некорректный формат данных';
    } else if (error === ConflictError) {
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

  // eslint-disable-next-line no-unused-vars,class-methods-use-this
  validateData(formData) {
    // todo
  }
}
