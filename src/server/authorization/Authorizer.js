export default class Authorizer {
  constructor(authenticator) {
    this.authenticator = authenticator;
  }

  getMiddleware() {
    return (req, res, next) => {
      try {
        req.user = this.authenticator.authenticate(req);
      } catch {
        // Should not do anything when authorization was not successful
      }
      next();
    };
  }
}
