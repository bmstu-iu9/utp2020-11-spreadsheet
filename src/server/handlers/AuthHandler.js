import EndpointHandler from './EndpointHandler.js';
import TokenModel from '../database/TokenModel.js';
import { result, Validation } from '../validation/Validation.js';

export default class AuthHandler extends EndpointHandler {
  post(req, res) {
    if (req.body === undefined
      || req.body.username === undefined || req.body.password === undefined) {
      return res.sendStatus(403);
    }
    const validator = new Validation(this.dataRepo);
    if (validator.validate(req.body.username, req.body.password, false) === result.ok) {
      if (this.dataRepo.tokenRepo.getByLogin(req.body.username) !== undefined) {
        const oldToken = this.dataRepo.tokenRepo.getByLogin(req.body.username).uuid;
        this.dataRepo.tokenRepo.delete(oldToken);
      }
      const token = new TokenModel(req.body.username);
      this.dataRepo.tokenRepo.save(token);
      return res.status(200).send({ token: token.uuid });
    }
    return res.sendStatus(403);
  }
}
