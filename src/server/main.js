import express from 'express';
import http from 'http';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import errorHandler from 'errorhandler';

let server;
let app;

export default class Server {
  static run() {
    app = express();

    app.set('port', 3000);

    app.set('view options', { layout: false });
    if (app.get('env') === 'development') {
      app.use(morgan('dev'));
    } else {
      app.use(morgan('short'));
    }

    app.use(cookieParser());

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(express.static('src/client'));

    app.get('/', (req, res) => {
      res.render('/index.html');
    });

    app.use(errorHandler());

    server = http.createServer(app);

    server.listen(app.get('port'), () => {});
  }

  static close() {
    server.close();
    app.delete({});
  }
}

Server.run();
