import HeaderMatcher from './HeaderMatcher.js';
import DataRepo from '../database/DataRepo.js';

export default class TokenAuthenticator {
  constructor(matcher, dataRepo) {
    this.setMatcher(matcher);
    this.setDataRepo(dataRepo);
  }

  setDataRepo(dataRepo) {
    if (!(dataRepo instanceof DataRepo)) {
      throw TypeError('userRepo must be a UserRepo instance');
    }
    this.dataRepo = dataRepo;
  }

  setMatcher(matcher) {
    if (!(matcher instanceof HeaderMatcher)) {
      throw TypeError('matcher must be a HeaderMatcher instance');
    }
    this.matcher = matcher;
  }

  authenticate(request) {
    const { headers } = request;
    const uuid = this.fetchTokenUuidFromHeaders(headers);
    const token = this.dataRepo.tokenRepo.getByUuid(uuid);
    const user = this.dataRepo.userRepo.get(token.login);
    return user;
  }

  fetchTokenUuidFromHeaders(headers) {
    let result;
    Object.keys(headers).forEach((key) => {
      const value = headers[key];
      if (this.matcher.doesHeaderMatch(key, value)) {
        result = this.matcher.fetchPayload(key, value);
      }
    });
    return result;
  }
}
