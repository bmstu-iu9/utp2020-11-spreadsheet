import WorkbookRepo from '../../server/database/WorkbookRepo.js';

export default class WorkbookHandler {
  constructor(database) {
    this.database = database;
  }

  get(login) {
    const workbookRepo = new WorkbookRepo(this.database);
    try {
      const result = workbookRepo.getByLogin(login);
      return {
        response: 200,
        workbooks: result,
      };
    } catch (error) {
      return { response: 401 };
    }
  }
}
