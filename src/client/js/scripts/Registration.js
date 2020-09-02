export default class Registration {
  constructor(form) {
    this.form = form;
    this.formData = new FormData(form);
    console.log(this.formData.getAll('username'), 'usernames');
  }

  register(request) {
    try {
      this.validateData(this.formData);
      request.send(this.getUsername(), this.getPassword());
    } catch (e) {
      this.errorHandler();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  errorHandler() {
    // todo
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
