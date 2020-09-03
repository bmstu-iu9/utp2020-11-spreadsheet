import FormatError from '../../../lib/errors/FormatError.js';

export default class Registration {
  constructor(form, resultHolder) {
    this.form = form;
    this.resultHolder = resultHolder;
  }

  register(request, handler) {
    if (!this.resultHolder.classList.contains('hide')) {
      this.resultHolder.classList.add('hide');
    }
    this.formData = new FormData(this.form);
    try {
      this.validateData();
    } catch (e) {
      handler.registerHandle(e);
    }
    request.send(this.getUsername(), this.getPassword(), handler);
    this.resultHolder.textContent = 'Вы успешно зарегистрированы';
    this.resultHolder.classList.remove('hide');
  }

  getUsername() {
    if (this.formData.has('username')) {
      return this.formData.get('username');
    }
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
