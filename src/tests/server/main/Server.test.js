import fs from 'fs';
import path from 'path';
import Server from '../../../server/main/Server.js';
import config from '../../../server/main/config.js';

describe('Server', () => {
  const faviconDirname = path.dirname(config.favicon);

  before(() => {
    fs.mkdirSync(faviconDirname, {
      recursive: true,
    });
    fs.writeFileSync(config.favicon, '');
  });
  after(() => {
    fs.rmdirSync(faviconDirname, {
      recursive: true,
    });
  });

  describe('#main()', () => {
    it('should create server twice successfully', () => {
      for (let i = 0; i < 2; i += 1) {
        const server = new Server(config);
        server.run();
        server.close();
      }
    });
    it('should launch successfully with env = production', () => {
      const configCopy = {
        ...config,
      };
      configCopy.env = 'production';
      const server = new Server(configCopy);
      server.run();
      server.close();
    });
  });
});
