export default class WorkbookPathGenerator {
  constructor(pathToWorkbooks) {
    this.setPathToWorkbooks(pathToWorkbooks);
  }

  generate(workbookId) {
    return `${this.pathToWorkbooks}/${workbookId}.json`;
  }

  setPathToWorkbooks(pathToWorkbooks) {
    if (typeof pathToWorkbooks !== 'string') {
      throw new TypeError('pathToWorkbooks must be a string');
    }
    this.pathToWorkbooks = pathToWorkbooks;
  }
}
