import EndpointHandler from './EndpointHandler.js';
import UserModel from '../database/UserModel.js';

export default class UsernameHandler extends EndpointHandler {
  validateAccess(req, res) {
    if (req.user === undefined) {
      return res.sendStatus(401);
    }
    if (req.user.getIsAdmin() === true || req.user.login === req.params.username) {
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
    return res.status(200).send(UserModel.fromUserToJSON(user));
  }

  patch(req, res) {
    const validationResult = this.validateAccess(req, res);
    if (validationResult !== true) {
      return validationResult;
    }
    if (req.body === undefined
      || req.body.isAdmin === undefined || req.body.password === undefined) {
      return res.sendStatus(400);
    }
    const user = this.dataRepo.userRepo.get(req.params.username);
    if (req.user.getIsAdmin() === false && user.getIsAdmin() !== req.body.isAdmin) {
      return res.sendStatus(403);
    }
    user.setPassword(req.body.password);
    user.setIsAdmin(req.body.isAdmin);
    this.dataRepo.userRepo.save(user);
    return res.status(200).send(UserModel.fromUserToJSON(user));
  }

  delete(req, res) {
    const validationResult = this.validateAccess(req, res);
    if (validationResult !== true) {
      return validationResult;
    }
    this.dataRepo.userRepo.delete(req.params.username);
    return res.sendStatus(200);
  }
}
