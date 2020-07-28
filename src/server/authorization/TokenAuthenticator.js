import HeaderMatcher from './HeaderMatcher.js';
import TokenRepo from '../database/TokenRepo.js';
import UserRepo from '../database/UserRepo.js';

export default class TokenAuthenticator {
  constructor(matcher, tokenRepo, userRepo) {
    this.setMatcher(matcher);
    this.setTokenRepo(tokenRepo);
    this.setUserRepo(userRepo);
  }

  setUserRepo(userRepo) {
    if (!(userRepo instanceof UserRepo)) {
      throw TypeError('userRepo must be a UserRepo instance');
    }
    this.userRepo = userRepo;
  }

  setMatcher(matcher) {
    if (!(matcher instanceof HeaderMatcher)) {
      throw TypeError('matcher must be a HeaderMatcher instance');
    }
    this.matcher = matcher;
  }

  setTokenRepo(tokenRepo) {
    if (!(tokenRepo instanceof TokenRepo)) {
      throw TypeError('tokenRepo must be a TokenRepo instance');
    }
    this.tokenRepo = tokenRepo;
  }

  fetchUserFromHeaders(headers) {
    const uuid = this.fetchTokenUuidFromHeaders(headers);
    const token = this.tokenRepo.getByUuid(uuid);
    const user = this.userRepo.get(token.login);
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
