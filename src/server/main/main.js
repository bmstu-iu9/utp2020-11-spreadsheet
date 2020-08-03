import express from 'express';
import http from 'http';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';
import errorHandler from 'errorhandler';
import config from './config.js';

let server;
let app;

export default class Server {
  static run() {
    app = express();

    app.set('port', config.port);

    app.set('view options', config.viewOptions);

    app.use(favicon(config.favicon));

    if (app.get('env') === 'development') {
      app.use(morgan('dev'));
    } else {
      app.use(morgan('short'));
    }

    app.use(cookieParser());

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded(config.urlencoded));

    app.use(express.static(config.static));

    app.get('/', (req, res) => {
      res.render(config.entrypoint);
    });

    app.use(errorHandler());

    server = http.createServer(app);

    server.listen(app.get('port'), () => { });
  }

  static close() {
    server.close();
    app.delete({});
  }
}

Server.run();
