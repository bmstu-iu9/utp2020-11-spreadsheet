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
import WorkbookHandler from '../handlers/WorkbookHandler.js';
import WorkbookIdHandler from '../handlers/WorkbookIdHandler.js';
import SaveSystem from '../save/SaveSystem.js';
import UserHandler from '../handlers/UserHandler.js';
import UsernameHandler from '../handlers/UsernameHandler.js';
import AuthHandler from '../handlers/AuthHandler.js';

export default class Server {
  constructor(config) {
    this.setConfig(config);
    this.configureApp();
    this.configureLogging();
    this.configureDataDirs();
    this.configureDataRepo();
    this.configureMiddleware();
    this.configureEndpoints();
    this.configureServer();
  }

  configureDataDirs() {
    const dataDirs = [
      this.config.dataPath,
      this.config.pathToWorkbooks,
      this.config.pathToCommits,
    ];
    dataDirs.forEach((dir) => {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    });
  }

  configureEndpoints() {
    const endpoints = {
      '/workbook': WorkbookHandler,
      '/workbook/:id': WorkbookIdHandler,
      '/user': UserHandler,
      '/user/:username': UsernameHandler,
      '/auth': AuthHandler
    };
    const saveSystem = new SaveSystem(this.config.pathToWorkbooks, this.config.pathToCommits);
    Object.keys(endpoints).forEach((path) => {
      const handler = new endpoints[path](this.dataRepo, saveSystem);
      this.app.get(path, (req, res) => handler.get(req, res));
      this.app.post(path, (req, res) => handler.post(req, res));
      this.app.patch(path, (req, res) => handler.patch(req, res));
      this.app.delete(path, (req, res) => handler.delete(req, res));
    });
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
    this.app.set('env', this.config.env);
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
