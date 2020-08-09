import Server from './Server.js';
import config from './config.js';

const server = new Server(config);
server.run();
