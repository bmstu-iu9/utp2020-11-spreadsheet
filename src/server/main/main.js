const http = require('http');

const server = new http.Server();

server.listen(3000, '127.0.0.1');

server.on('request', (req, res) => {
  res.end('Hello, World!');
});
