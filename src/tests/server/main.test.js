import Server from '../../server/main.js';

describe('Server', () => {
  describe('#main()', () => {
    it('should run and close server', () => {
      // server starts when imports
      Server.close();
    });
  });
});
