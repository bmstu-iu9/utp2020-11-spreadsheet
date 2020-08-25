import EndpointHandler from './EndpointHandler.js';
import { result, Validation } from '../validation/Validation.js';
import UserModel from '../database/UserModel.js';

export default class UserHandler extends EndpointHandler {
  post(req, res) {
    if (req.body === undefined
      || req.body.username === undefined || req.body.password === undefined) {
      return res.sendStatus(400);
    }
    const validator = new Validation(this.dataRepo);
    const validationResult = validator.validate(req.body.username, req.body.password, true);
    if (validationResult === result.ok) {
      const user = new UserModel(req.body.username, false, req.body.password);
      this.dataRepo.userRepo.save(user);
      return res.status(200).send(UserModel.fromUserToJSON(user));
    }
    if (validationResult === result.loginUnavailable) {
      return res.sendStatus(409);
    }
    return res.sendStatus(400);
  }

  get(req, res) {
    if (req.user === undefined) {
      return res.sendStatus(401);
    }
    if (req.user.getIsAdmin() === true) {
      const list = UserModel.fromUsersToJSON(this.dataRepo.userRepo.getAllUsers());
      return res.status(200).send(list);
    }
    return res.sendStatus(403);
  }
}
