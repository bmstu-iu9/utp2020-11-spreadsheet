import EndpointHandler from './EndpointHandler.js';
import UserModel from '../database/UserModel.js';

export default class UsernameHandler extends EndpointHandler {
  validateAccess(req, res) {
    if (req.user === undefined) {
      return res.sendStatus(401);
    }
    if (req.user.isAdmin === 1 || req.user.login === req.params.username) {
      const user = this.dataRepo.userRepo.get(req.params.username);
      if (user === undefined) {
        return res.sendStatus(404);
      }
      return true;
    }
    return res.sendStatus(403);
  }

  get(req, res) {
    const validationResult = this.validateAccess(req, res);
    if (validationResult !== true) {
      return validationResult;
    }
    const user = this.dataRepo.userRepo.get(req.params.username);
    return res.status(200).send(UserModel.fromUserToSQL(user));
  }
}
