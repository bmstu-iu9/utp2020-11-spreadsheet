import Server from '../../../server/main/Server.js';
import config from '../../../server/main/config.js';

describe('Server', () => {
  describe('#main()', () => {
    it('should run and close server', () => {
      const server = new Server(config);
      server.run();
      server.close();
    });
  });
});
