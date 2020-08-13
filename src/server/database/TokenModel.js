import { v4 as uuidv4 } from 'uuid';
import UserModel from './UserModel.js';
import FormatError from '../../lib/errors/FormatError.js';
import UuidValidator from '../../lib/uuid/UuidValidator.js';

export default class TokenModel {
  constructor(login, uuid = uuidv4()) {
    this.setLogin(login);
    this.setUuid(uuid);
  }

  setLogin(login) {
    if (!UserModel.isLoginCorrect(login)) {
      throw new FormatError('incorrect login');
    }
    this.login = login;
  }

  setUuid(uuid) {
    if (!UuidValidator.isUuidValid(uuid)) {
      throw new FormatError('incorrect UUID');
    }
    this.uuid = uuid;
  }

  static fromSQLtoToken(row) {
    const token = new TokenModel(row.login, row.uuid);
    return token;
  }

  static fromSQLtoTokens(rows) {
    const result = [];
    rows.forEach((row) => {
      result.push(TokenModel.fromSQLtoToken(row));
    });
    return result;
  }
}
