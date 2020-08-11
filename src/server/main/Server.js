import express from 'express';
import http from 'http';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';
import errorHandler from 'errorhandler';
import Database from 'better-sqlite3';
import fs from 'fs';
import HeaderMatcher from '../authorization/HeaderMatcher.js';
import TokenAuthenticator from '../authorization/TokenAuthenticator.js';
import Authorizer from '../authorization/Authorizer.js';
import DataRepo from '../database/DataRepo.js';
import ConsoleLogger from '../../lib/logging/ConsoleLogger.js';
import logLevel from '../../lib/logging/logLevel.js';

export default class Server {
  constructor(config) {
    this.setConfig(config);
    this.configureApp();
    this.configureLogging();
    this.configureDataRepo();
    this.configureMiddleware();
    this.configureServer();
  }

  run() {
    this.listen();
  }

  close() {
    this.server.close();
    this.app.delete({});
  }

  setConfig(config) {
    this.config = config;
  }

  configureApp() {
    this.app = express();
    this.app.set('port', this.config.port);
    this.app.set('view options', this.config.viewOptions);
  }

  configureLogging() {
    let loggerLogLevel;
    if (this.app.get('env') === 'development') {
      this.app.use(morgan('dev'));
      loggerLogLevel = logLevel.debug;
    } else {
      this.app.use(morgan('short'));
      loggerLogLevel = logLevel.info;
    }
    this.logger = new ConsoleLogger(loggerLogLevel);
  }

  configureDataRepo() {
    fs.mkdirSync(this.config.dataPath, {
      recursive: true,
    });
    const databasePath = `${this.config.dataPath}/${this.config.databaseName}`;
    const database = new Database(databasePath);
    this.dataRepo = new DataRepo(database, this.logger);
    this.dataRepo.syncDatabaseStructure();
  }

  configureMiddleware() {
    this.app.use(favicon(this.config.favicon));
    this.app.use(cookieParser());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded(this.config.urlencoded));
    this.useTokenAuthorization();
    this.app.use(express.static(this.config.static));
    this.app.use(errorHandler());
  }

  configureServer() {
    this.server = http.createServer(this.app);
  }

  listen() {
    this.server.listen(this.app.get('port'), () => { });
  }

  useTokenAuthorization() {
    const matcher = new HeaderMatcher(
      this.config.headerMatcher.name,
      this.config.headerMatcher.prefix,
    );
    const authenticator = new TokenAuthenticator(matcher, this.dataRepo);
    const authorizer = new Authorizer(authenticator);

    this.app.use(authorizer.getMiddleware());
  }
}
