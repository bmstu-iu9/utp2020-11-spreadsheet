import Server from '../../server/main.js';

describe('Server', () => {
  describe('#main()', () => {
    it('should run and close server', () => {
      Server.close();
    });
  });
});
