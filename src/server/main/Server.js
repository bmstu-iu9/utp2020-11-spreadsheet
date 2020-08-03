import express from 'express';
import http from 'http';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';
import errorHandler from 'errorhandler';

export default class Server {
  constructor(config) {
    this.config = config;
  }

  run() {
    this.app = express();

    this.app.set('port', this.config.port);

    this.app.set('view options', this.config.viewOptions);

    this.app.use(favicon(this.config.favicon));

    if (this.app.get('env') === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('short'));
    }

    this.app.use(cookieParser());

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded(this.config.urlencoded));

    this.app.use(express.static(this.config.static));

    this.app.get('/', (req, res) => {
      res.render(this.config.entrypoint);
    });

    this.app.use(errorHandler());

    this.server = http.createServer(this.app);

    this.server.listen(this.app.get('port'), () => { });
  }

  close() {
    this.server.close();
    this.app.delete({});
  }
}
