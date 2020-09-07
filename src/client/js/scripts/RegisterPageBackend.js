import WrongSecondPasswordError from '../../../lib/errors/WrongSecondPasswordError.js';

export default class RegisterPageBackend {
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
      RegisterPageBackend.validateRegisterData(formData);
      request.send(RegisterPageBackend.getUsername(formData),
        RegisterPageBackend.getPassword(formData), handler);
    } catch (e) {
      handler.registerErrorHandle(e);
    }
  }

  authorize(request, handler) {
    if (!this.resultHolder.classList.contains('hide')) {
      this.resultHolder.classList.add('hide');
    }
    const formData = new FormData(this.authorizeForm);
    request.send(RegisterPageBackend.getUsername(formData),
      RegisterPageBackend.getPassword(formData), handler);
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
    if (RegisterPageBackend.getPassword(formData) !== formData.get('repeat-password')) {
      throw new WrongSecondPasswordError('Wrong second password');
    }
  }
}
