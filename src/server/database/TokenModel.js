import { v4 as uuidv4 } from 'uuid';
import UserModel from './UserModel.js';

export default class TokenModel {
  constructor(login, uuid = TokenModel.generateUuid()) {
    this.setLogin(login);
    this.setUuid(uuid);
  }

  setLogin(login) {
    if (!UserModel.isLoginCorrect(login)) {
      throw new Error('incorrect login');
    }
    this.login = login;
  }

  setUuid(uuid) {
    if (!TokenModel.isUuidValid(uuid)) {
      throw new Error('incorrect UUID');
    }
    this.uuid = uuid;
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
