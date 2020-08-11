import Server from '../../../server/main/Server.js';
import config from '../../../server/main/config.js';

describe('Server', () => {
  describe('#main()', () => {
    it('should create server twice successfully', () => {
      for (let i = 0; i < 2; i += 1) {
        const server = new Server(config);
        server.run();
        server.close();
      }
    });
  });
});
