import express from 'express';
import http from 'http';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';
import errorHandler from 'errorhandler';
import Database from 'better-sqlite3';
import DataRepo from '../database/DataRepo.js';
import ConsoleLogger from '../../lib/logging/ConsoleLogger.js';
import logLevel from '../../lib/logging/logLevel.js';

export default class Server {
  constructor(config) {
    this.config = config;
  }

  run() {
    this.app = express();

    this.app.set('port', this.config.port);

    this.app.set('view options', this.config.viewOptions);

    this.app.use(favicon(this.config.favicon));

    let loggerLogLevel;
    if (this.app.get('env') === 'development') {
      this.app.use(morgan('dev'));
      loggerLogLevel = logLevel.debug;
    } else {
      this.app.use(morgan('short'));
      loggerLogLevel = logLevel.warning;
    }

    const database = new Database(this.config.database);
    const logger = new ConsoleLogger(loggerLogLevel);
    const dataRepo = new DataRepo(database, logger);
    dataRepo.syncDatabaseStructure();

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
