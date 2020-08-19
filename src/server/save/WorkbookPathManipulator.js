import WorkbookPathGenerator from './WorkbookPathGenerator.js';

export default class WorkbookPathManipulator {
  constructor(workbookPathGenerator) {
    this.setWorkbookPathGenerator(workbookPathGenerator);
  }

  setWorkbookPathGenerator(workbookPathGenerator) {
    if (!(workbookPathGenerator instanceof WorkbookPathGenerator)) {
      throw new TypeError('workbookPathGenerator must be a WorkbookPathGenerator instance');
    }
    this.workbookPathGenerator = workbookPathGenerator;
  }
}
