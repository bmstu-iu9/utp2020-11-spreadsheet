import { v4 as uuidv4 } from 'uuid';
import UserModel from './UserModel.js';
import FormatError from '../../lib/errors/FormatError.js';

export default class TokenModel {
  constructor(login, uuid = TokenModel.generateUuid()) {
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
    if (!TokenModel.isUuidValid(uuid)) {
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

  static generateUuid() {
    return uuidv4();
  }

  static isUuidValid(uuid) {
    const regExp = new RegExp(
      '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
    );
    return regExp.test(uuid);
  }
}
