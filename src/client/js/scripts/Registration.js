import FormatError from '../../../lib/errors/FormatError.js';

export default class Registration {
  constructor(authorizeForm, registerForm, resultHolder) {
    this.registerForm = registerForm;
    this.resultHolder = resultHolder;
    this.authorizeForm = authorizeForm;
  }

  register(request, handler) {
    if (!this.resultHolder.classList.contains('hide')) {
      this.resultHolder.classList.add('hide');
    }
    const formData = new FormData(this.registerForm);
    try {
      Registration.validateRegisterData(formData);
    } catch (e) {
      handler.registerHandle(e);
    }
    request.send(Registration.getUsername(formData), Registration.getPassword(formData), handler);
    this.resultHolder.textContent = 'Вы успешно зарегистрированы';
    this.resultHolder.classList.remove('hide');
  }

  authorize(request, handler) {
    if (!this.resultHolder.classList.contains('hide')) {
      this.resultHolder.classList.add('hide');
    }
    const formData = new FormData(this.authorizeForm);
    request.send(Registration.getUsername(formData), Registration.getPassword(formData), handler);
    this.resultHolder.textContent = 'Вы успешно вошли';
    this.resultHolder.classList.remove('hide');
  }

  static getUsername(formData) {
    if (formData.has('username')) {
      return formData.get('username');
    }
    return undefined;
  }

  static getPassword(formData) {
    if (formData.has('password')) {
      return formData.get('password');
    }
    return undefined;
  }

  static validateRegisterData(formData) {
    if (Registration.getPassword(formData) !== formData.get('repeat-password')) {
      throw new FormatError('Wrong second password');
    }
  }
}
