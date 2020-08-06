import NotImplementedError from '../errors/NotImplementedError.js';

export default class AbstractLogger {
  constructor(logLevel) {
    this.setLogLevel(logLevel);
  }

  setLogLevel(logLevel) {
    if (!(typeof logLevel === 'number')) {
      throw new TypeError('log level must be a number');
    }
    this.logLevel = logLevel;
  }

  acceptLog(logLevel, message) {
    if (logLevel >= this.logLevel) {
      this.addLog(message);
    }
  }

  addLog() {
    throw new NotImplementedError(this.constructor);
  }
}
