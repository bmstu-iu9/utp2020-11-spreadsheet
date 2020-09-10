export default class PersonalPageResultHandler {
  constructor(workspacePageUrl) {
    this.workspacePageUrl = workspacePageUrl;
  }

  addBookResultHandle() {
    window.location.href = this.workspacePageUrl;
  }

  addBookErrorHandle(e) {
    // todo
  }
}
